So I added comments in the UI. I had to make some decisions about how to approach this problem.

Originally I wrote some comment support code in the backend. I also started creating a comment section in the post that would use that would have an editor and use that endpoints to handle the comments in the post.

However, down the road I got a little bit annoyed at that task. It seemed too much work and in some cases almost unnecessary. And then it occured to me, why not to use [Disqus](https://disqus.com)? 

So I took out all that and used [this npm package](https://www.npmjs.com/package/react-disqus-thread) instead. It's a nice package and it works, but I should say that the documentation isn't very comprehensive. I had to go over the iframe url and check the parameters passed to see what to put in. However, it wasn't that bad and an hour latter was working as expected.

The next things that will be added into the project.

1. I'd like to add a loading screen. Not sure if it's the heroku server of the API or the connection with mlab, but once in a while the api response takes too much to appear and you just see a white screen. Not cool. A temporary solution: A loading screen.
2. Add pagination in the server side.
3. Prepare the plugins for the server side so I can add a search engine, archives and categories.
