# Docker and Node made easy

Recently, I started working in a new project for a new client. The idea is to make an app that will list all the happy hours that are happening near you. I decided to use the same stack that I'm using in my other projects right, because I don't like change. That's Scala and PostgreSQL for the backend and Typescript with React for the frontend. We would deploy the app using containers through Heroku.

While I was preparing the containers, I made a wonderful discovery: [sbt-docker](https://github.com/marcuslonnberg/sbt-docker). It's a plugin for `sbt`, the build tool I use when I program in Scala, to create containers from scala projects. It's nice for two reasons:

- I can build the new image by just typing `sbt docker`.
- I can write the specs of my docker image (i.e. the Dockerfile) using Scala. This let's me avoid having to remember the details of the Dockerfile syntax and at the same time, have all the project completily integrated.

I enjoyed so much that plugin, that I decided to look for something similar for Node and there was nothing that satisfied my expectatives completely. And so, I decided that I'd write my own.

## Requirements

This is what I want:

1. I want to be able to cover 90% of the most usual cases without having to write any extra code. I want to do something like this in the main directory: `name-of-the-awesome-tool --name container-name --tag container-tag --port 8080` and get a new image tagged as `container-name:container-tag` that will run the project on port 8080.
2. I want it to be integrated in the node ecosystem. I.e. I want to be able to install it using `npm` and to create an script in the `package.json` file that will automatically run the command mentioned above.
3. For the other 10% of the cases, in which I need something more particular, I want to be able to handle them using Javascript (no Dockerfile syntax, please, I have enough having to remember all the languages I use) and in an expressive way. As similar as possible to what you would do with `sbt-docker`.

## Basic Dockerfile

Usually most of my node apps have a Dockerfile that looks something like this:

```
FROM node
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8080
CMD [ "npm", "start" ]
```

Some notes about this approach:

1. As you can see, I'm not defining a node version in the image I pull from. I do that in my apps, normally, but for this case I'll ignore it. It's not as simple as it may seem. For now, I'll use lastest version. In the future, I'll parse section [engines](https://docs.npmjs.com/files/package.json#engines) to decide which one to specify.
2. I'm copying first the `package.json` and then the rest of the directory. The reason is very simple: This way I can cache the step of running `npm install`. The benefit being not having to run it every time I modify something in the code that isn't related with my dependencies.
3. I use the convention `npm start`. For the same reason than 1., I prefer to delegate as much logic as possible to the node configuration file. If you want to see how to start an app, you should look at `package.json`, not at the Dockerfile.

Ideally, my new app will create something very similar to that by default.

## Basic usage

Let's start coding. The first thing that I want is a class to create Dockerfiles. Said class should accept a container name in the constructor and it should have different methods to describe how to create the Dockerfile.

I want the usage of this class to be something like this:

```
new Dockering(imagename)
  .from('ubuntu')
  .run(command)
  .env(envVariableList)
  // Etc
```

I.e. I want to be able to chain different docker instructions in one statement. I also want the class to be immutable:

```
const dockerfile = new Dockering(imagename)
  .from('ubuntu'); // this is one dockerfile
const otherDockerfile = dockerfile
  .run(command); // this is a different one, based on the previous one
```

I decided to write this using Typescript, because I like to have a compiler that will detect my mistakes. Using Typescript, I'd create a new interface called `Instruction` and a new class called `Dockering`. The class will have a list of `Instruction` and a set of methods that will define the Docker instructions and return a new `Dockering` class according to that. I want also a method `build` that will compile all the instructions into a docker image.

```
import * as instructions from './instructions';

export default class Dockering {
  constructor(
    public name: string = path.basename(__dirname),
    public instructions: Array<instructions.Instruction> = [],
    public docker: Docker = new Docker({ socketPath: '/var/run/docker.sock' })) { }

  run(command: string | Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Run(command));
  }

  cmd(command: string | Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Cmd(command));
  }

  expose(ports: Array<number>): Dockering {
    return this.withNewInstruction(new instructions.Expose(ports));
  }

  add(srcs: Array<string>, dst: string): Dockering {
    return this.withNewInstruction(new instructions.Add(srcs, dst));
  }

  shell(cmd: Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Shell(cmd));
  }

  // Etc.

  build(project: string = '.'): Promise<{}> {
    const tarStream = tar
      .pack(project, {
        ignore: (name: string) => name.indexOf('node_modules') === 0
      });
    const dockerfileContent = this.instructions.map(i => i.toString()).join('\n');
    tarStream.entry({ name: 'Dockerfile' }, dockerfileContent)
    return this.docker.image.build(tarStream, { t: this.name })
      .then((stream: Stream) => promisifyStream(stream));
  }

  private withNewInstruction(newInstruction: instructions.Instruction): Dockering {
    return new Dockering(this.name, this.instructions.concat([newInstruction]), this.docker);
  }
}
```

You can see a full example of this [here](https://github.com/AgustinCB/dockering/blob/868c53945db2b4d0f1ee5aefb3297b9bbd31ec53/src/index.ts).

I think most of that code explains by itself, with the exception of the `build` method. Some comments there:

1. I'm using two external libraries: `tar-fs` to deal with tar files and `docker-node-api` to deal with the docker API.
2. I don't include in the docker file the content of the node_modules folder.
3. I don't actually create a Dockerfile in the user filesystem, but add it into the tar stream that will be passed to docker. No need to slow things down by saving to disk.
4. The function `promisifyStream` receives an stream and returns a `Promise` that succeeds after the event `end` is fired and is rejected if the event `error` happened. On `data`, it prints the content in the terminal, so you can see the progress of the build.
5. You can see the content of the instructions file [here](https://github.com/AgustinCB/dockering/blob/5877efe77ec1be4a76fd3efbf42690aab01a76a2/src/instructions.ts) although that's not necessary to understand how this works.

The usage of that class is exactly what we were looking for. 

## Command line interface

Now we have to define a command line interface usage to cover most of the usual cases. To do so, I'll use the library `minimist` and create a function that receives arguments parsed by that framework to handle the command line behaviour.

```
export interface Args {
  cmd?: string;
  project?: string;
  name?: string;
  tag?: string
  port?: string;
};

export interface Package {
  name: string;
};

const getConfig = (path: string): Package => {
  try {
    return require(path);
  } catch (e) {
    console.log('error', path, e);
    throw 'could not find package.json';
  }
};

export default function (args: Args): Promise<{}> {
  const startCmd = args.cmd || 'npm start';
  const projectPath = args.project || process.cwd();
  const port = parseInt(args.port) || 8080;
  const confFile = `${projectPath}/package.json`;
  const configuration = getConfig(confFile);
  const name = args.name || configuration.name;
  const tag = args.tag || 'latest';
  return (new Dockering(`${name}:${tag}`))
    .fromImage('node')
    .run('mkdir /app')
    .workdir('/app')
    .copy(['package.json'], '/app')
    .run('npm install')
    .copy(['.'], '/app')
    .expose([port])
    .cmd(startCmd.split(' '))
    .build(projectPath);
}
```

You can see the file [here](https://github.com/AgustinCB/dockering/blob/f23bd6f5188fbaa6616a4c8e10ce4b6cafd3dd77/src/command.ts)

As you can see, our command line tool will create a Dockerfile very similar to the one saw before! Which is exactly what we wanted.

With that, we can create a new executable in the project. For example, under `bin/dockering`:

```
#!/usr/bin/env node

const minimist = require('minimist'),
  command = require('../lib/command').default,
  Dockering = require('../lib/index').default;

if (require.main === module) {
  const args = minimist(process.argv.slice(2))
  command(args)
    .catch((err) => console.log('An error happened!', err))
}
```

Which is more than enough.

The usage of this command line tool, would be something similar to this:

```
dockering --name newimagename --tag tag --cmd "npm start" --port 8080 --project .
```

That way, we can create a new script in `package.json` to dockerify our node apps in one very simple step:

```
{
  "scripts": {
    "docker": "dockering"
  }
}
```

And that's all!

You can check the full code example [here](https://github.com/AgustCB/dockering) and the npm package [here](https://www.npmjs.com/package/dockering).
