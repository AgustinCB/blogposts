And I finally finished the backend of my blog. I decided to called [Simple Blog Machine](npmjs.com/package/node-docker-api). Why the name? Because when I used to like forums and I used to play with SMF (simple machine forum) so I decided to get inspiration from there.

So what's on there?

## REST API

The package contains the basic REST API for a blog. By doing this I can care about the frontend as something completely separated. The API is very very very simple

```GET /api/post
GET /api/post/:id
POST /api/post
PUT /api/post/:id
DELETE /api/post/:id
GET /api/comment
GET /api/comment/:id
POST /api/comment
PUT /api/comment/:id
DELETE /api/comment/:id
```

Easier to see in the code as an [example](https://github.com/AgustinCB/sbm/blob/master/test/main.js).

## Command Line Interface

I'm lazy. I don't want to leave my terminal and go to the browser and open a tab and go to a url and all that boring stuff. I want to be able to open vim write something in a text file and use a command to send it. That's all. And here I can:

```sbm start --username AdminUsername --password AdminPassword --port 3000
sbm login --username AdminUsername --password AdminPassword --url localhost:3000
sbm create post --title "POST TITLE" --content "$(cat /path/to/post/content.md)"
sbm edit post --content "$(cat /path/to/new/post/content.md)"
sbm read posts
sbm delete post 58628986b9067c0012ad0ae8
```

Very easy. No need to stupid user interfaces.

## Plugins

So I had a problem. I wanted two opposite things: I want it to be very simple and at the same time I want to be able to do crazy complicated stuff too. But simple.

So I decided that the core of the service will the above mentioned and it will have a system to allow you expand it. Some kind of plugin system. I made a simple approach [here](https://github.com/AgustinCB/sbm/tree/master/src/plugins). Right now it's hardcored. What brings me to the next point.

## Next steps

- Make the plugins more configurable (i.e. remove that hardcored stupidity).
- Dockerify the system.

If you're curious, [the code](https://github.com/AgustinCB/sbm).
