And I made the first version of the blog's UI. Made with React, Reflux and browserify, I have so far covered the following areas:

1. A basic home page with the last five blog entries.
2. A basic post page.

It really doesn't have much. I wanted to do it as simple as possible. I used [pure css](http://purecss.io) and the basic [blog layout](http://purecss.io/layouts/blog/) for the css. The code can be checked [here](https://github.com/AgustinCB/agustincb.github.io) (don't expect anything good, I'm really new at ReactJS).

The next steps I'm thinking are:

1. Move some information hard-coded into the code to the backend. The name, the description of the blog and other related information should be in fetchable from the API. I'm thinking about adding some kind of global collection with keys and values for this kind of information. Ideally, I should be able to easily cache this, but I won't worry about that now.
2. Create a comment section in the post page. A user should be able to see previous comments and to write their own.

Now I feel a little bit more comfortable about exposing the blog around there. It still needs some work, though, but it's a good start.
