# Docker and Node made easy

Recently I started working in a new project for a new client. The idea is to make an app that will list all the happy hours happening near you in the next hours. I decided to use the same stack that I'm using in my other projects: Scala and PostgreSQL for the backend and Typescript with React for the frontend. We would deploy the app using containers through Heroku.

While I was preparing the containers, I made a wonderful discovery: [sbt-docker](https://github.com/marcuslonnberg/sbt-docker). It's a plugin for `sbt`, the build tool I use when I program in Scala. It's nice for two reasons:

- I can build the new image by just typing `sbt docker`.
- I can write the specs of my docker image (i.e. the Dockerfile) using Scala. This let's me avoid having to remember the details of the Dockerfile syntax and at the same time, have all the project completily integrated.

I enjoyed so much that plugin, that I decided to look for something similar for Node and there was nothing that completely satisfied my expectatives. And so, I decided that I'd write my own.

## Requirements

This is what I want from this plugin:

1. I want to be able to cover 90% of the most usual cases without having to write any extra code. I want to do something like this in the main directory: `name-of-the-awesome-tool --name container-name --tag container-tag --port 8080` and get a new image tagged as `container-name:container-tag` without anything extra.
2. I want it to be integrated in the node ecosystem. I.e. I want to be able to install it using `npm` and to create an script in the `package.json` file that will automatically run the command mentioned above.
3. For the other 10% of the cases, in which I need something more particular, I want to be able to handle them using Javascript (no Dockerfile syntax, please, I have enough having to remember all the languages I use) and in an expressive way. As similar as possible to what you would use with `sbt-docker`.

## Basic Dockerfile
