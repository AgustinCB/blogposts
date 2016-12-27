So this is my first blog post in **cat /var/log/me**.

I should confess, this is something I wanted to do for a long time. I always fantasized about writing a blog with my programming experiences, but there was some things pushing me back:

1. I'm lazy and lack commitment.
2. Most of the blog systems out there aren't really attractive. Don't get me wrong, I can understand why Wordpress or Blogspot are great solutions, but they just don't fit me. They are big, complex and have a lot of user interfaces that just feel like too much. When I think about writting a blog, I always picture myself writing the posts from my vim editor, in markdown syntax and submitting it without leaving my terminal. Unfortunatelly, I don't know any platforms that offers that.

The first problem is easy to solve. And I'm working on it.

The second one is more painful. And difficult to approach. There just isn't anything that fits my needs (I far as know).

### The light

And then I read in Quora an answer of [Vladimir Zorov](https://www.quora.com/profile/Vladislav-Zorov). I can't find the exact answer, but he was basically saying that he started creating a blog from scratch and posted there a set of series about the experience of writing the blog. He explains it very well [here](http://vladizorov.info/). 

And I thought: 'This is marvellous!' I can write the exact type of blog system that want to use and at the same time I'd have the content for my first posts. So I decided to copy Vladimir's idea (a guy I strongly recommend you follow in quora, by the way).

### The objective

So, the first thing I decided to do was define what I'd be doing. I came with some principles:

1. It has to be simple. I don't need anything complex, just the hability of create post, comment, login and that's it.
2. It should be extensible. Despite the fact that I don't want to overcomplicate things, I'd also want to be able to add new features. But I want them as isolated pieces of code independent from the project, plugable and easy to add and remove.
3. It should work from the terminal. I really don't want to fight with an online editor. I prefer to use my old vim, my old bash, my old pandoc. And I don't want to learn new things. I'm lazy.

### The result

And that's how [sbm](https://github.com/AgustinCB/sbm). It's a simple blog written in nodejs, with just two things: A server, which exposes a REST API to create, updated, delete and view posts, comments and users and a simple cli to do it.

And so, I can use it like that:

```$ sbm start &
$ sbm login --url localhost:3000 --username admin --password admin
$ sbm read posts
$ sbm create post --title 'My new post' --content 'The content of my post'
```

I'd store the posts in this [repo](https://github.com/AgustinCB/blogposts).

And this is my first post in it. Of course, you won't be able to see it in real time, because right is just a REST API with no user interface in it. But that's the next step on it. And so far it's going very well.
