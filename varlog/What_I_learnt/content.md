# What I learnt in half a year of mentoring

In November past year I started working with Roy, a very nice guy that (at the time) wanted to improve his Ruby on Rails and ReactJS skills. He would be my first mentoree and, as a matter of fact, the first one ever learning anything from me.

A couple days ago I was contacted by another possible mentoree and at this point, before my second adventure, I think is a good time to review how things have gone, what worked and what could be improved. It's been more than six months since then and a lot of things have changed.

## My initial expectations

Before starting with Roy, I had some ideas of what I was expecting from our sessions.

The first thing I wanted was a long term relationship. I don't think I'm good enough to make any kind of impact in someone in less than a couple weeks. I'd need more time to be able to transmit anything.

The second thing I wanted is a professional focus. Although it's alright to learn programming for sake of it or to focus on computer science, what I really like is software engineering. I'm looking for someone whose objective is being able to build fully functional systems.

On the other hand, I wasn't really sure on how I wanted to conduct the sessions. Would we do some pair programming? That would require him to know something before hand. Would the old method of giving and reviewing exercises work? It never did for me in University. Should we focus our sessions on topics to learn or projects to create? No. Fucking. Clue.

Admittedly, that was my first mistake. Not knowing exactly how I wanted to conduct the process leaded to a very sloppy first session. I made all the decisions on the spot, after a quick chat with him and just played with it. Roy was smart enough to follow my rhythm with no problem and we were able to improve the feeling by the next one, but a better preparation in my end would have made the process smoother.

I think all this could have been prevented with a prescreening. If I had had a fifteen minutes chat with him before the first session, I'd have had a good feeling on where he was at and what he was expecting and I'd have been able to design a plan for the beginning. That's the first lesson I learnt!

## Our first contacts

Roy had a couple unusual qualities that I wasn't expecting before hand: He already know the basics of programming (in fact, he had a couple years of experience) and he was working professionally in the field. In fact, his company was sponsoring the process. I came to realise quickly that most people looking for a mentor aren't outside the industry but inside: As junior developers wanting to improve their skills or in related positions (business intelligence, TPM, web designers) trying to make a career move.

Because of his background, my first decision was to do pair programming sessions. We would pick a project to build (in our case, a forum) and we would go through the process of building it together.

I chose pair programming because it worked with me. My "mentor" was one of my early managers, Ken Demarest, and every time we'd sit together and work in a problem hand by hand I'd leave with a handful of new knowledge and the feeling that I was little bit better. I'm not sure it's the most productive practice in a work environment and I'll argue with anyone claiming so, but it's definitely a brilliant way to transfer knowledge.

And that was my first victory: I think that approach worked very well with us. The process is:

We start by discussing the problem we were trying to solve this time, I explain briefly how to do it and maybe put a couple examples and then, with he sharing his screen, we implement it. If he gets blocked, I help him solve the problem, but otherwise I let him continue still he's finished. After that, we discuss his approach and how it could be improved.

One of the difficulties that I faced, specially at the beginning, is knowing when to participate. Should I dictate every step? Let him go? Correct errors as I saw them? And what about the style?

After some try and error, I learnt a couple tricks:

- At the beginning, dictating is useful. Specially while learning a technology or technique that is unknown for him. Just saying what's expected, let him type it and discuss it after works very well. It gives him the chance to see how to approach that kind of problem and the feeling of the solution.

- Dictacting doesn't work past certain point. A couple of times, Roy actively asked me if he could solve certain situation by himself first. That was a heads up for me: I wasn't giving him enough chance to test what we were learning together. Once he saw a couple times how to test an endpoing in Rails, he wanted to write the next test. Fair enough! Letting do so helped me to see what he understood and what needed a quick review.

I was very pleased to confirm that this approach works. After a couple times going through the process of designing a solution, he surprised me a couple times by pointing out beforehand what code needed refactor and how it should be done or seeing the correct pattern to use in certain problems. That was very rewarding to me: It meant that he was getting something from our sessions.

## Forgetting about the technologies

Although the original idea was to work on Rails and React, I wanted to make our sessions technology agnostics. I didn't want to leave him as a "Rails&React developer" but as someone who is able to learn something new and build projects with it. Knowing how to break down projects, how to understand a type system or how to write testable code are far more important skills.

At the beginning that was a little bit difficult, specially because I didn't how to push our sessions that way. However, the fact that Roy had previous working experience and already knew the basis of the technologies we were using, helped a lot in this matter. Slowly, I tried to focus our time on how to engineer projects and how to pick tool rather than mastering the hammer and the saw.

Something that helped me here was introducing new things in the equation: "Ey, what if we convert our web app in a phone app?", "Ey, what if we put all this in a Docker container?", "Ey, what if we use typescript?"

That was my second victory. I think that taking a more elastic approach in what to learn helped us a lot. I knew when something very small (and unplanned) happened:

Usually, when a problem raised during our sessions, my first step would be to go to the documentation, read about the part of the code that was causing an issue and see if the usage matched what we were doing.

Well, one day, Roy had the documentation opened before me! That may seem anecdotic, but it was an excellent signal for me: It meant that he was learning how to approach a new technology.

TL;DR: We started developing a forum with Rails and React. We're now creating a system to classify blog posts scrapped from blogger by subjects using Spark/Scala and Scrapy/Python. Switching technologies gave me the chance to teach transferable skill that aren't tied to a particular language or framework.

## The art of debugging

I don't want to leave without speaking about this. I think that most of the time we spend together, we spend it debugging errors. And we have seen them of all colors:

- Typos, variables without the expected content & co: Specially when programming with Javascript. And I think that was a big lesson for us: A compiler would have caught that. In fact, when we started using Typescript he (and I) was very happy about the results in that area.

- Third party errors: A couple times, we found bugs in the libraries we were using. That gave us a lot of cool opportunities: First, to learn how to properly administrate dependencies and second to learn how to submit a pull request with fixes. He even made a contribution to the repository [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) to fix one of the problems we were having.

- CORS problems. Because no one can escape CORS while working in web development.

- OOM (Out Of Memory). When we moved to big data processing, we faced in a couple cases problems with lack of memory. That gave us the chance to learn how to analyse our solutions and how to optimize it. And if it can be optimized! In a couple situations, we simply had to deal with smaller data.

While it can be frustrating to spend time chasing errors, I think it's really valuable. Specially when you're trying to learn how to actually build software. Let's face it, for us working in the industry, debugging makes a big part of our work. It isn't glamurous, it isn't funny, it isn't recommended for your health, but it's necessary. And knowing how to read an stack trace, how to identify what part of the code is involved and to reason about errors is one of the most important skills that a developer should have.

## What I know now

So I'm about to start with a new mentee. After all this time, what did I learn?

- Choosing a long term relationship was a good idea. I don't think our agreement with Roy would have worked as well if we had only two or three weeks. I'm far from being that good!

- Prescreening is important. Knowing before hand what to expect, what they know and what they expect to learn is vital and helps making the start smooth.

- Don't focus all your energies on technologies. Just learning Rails and React doesn't work long term. It's often more important to know how to learn a new stack, how to debug for a problem, how to read code that isn't yours, how to structure a project or how to differenciate trade offs in designs.

- Adaptability. I, as a mentor, should know how to adapt to the person I'm working with and the expectations that they have.

I feel that Roy had to suffer a bit of my inexperience in the subject, and I apologise for that. At the same time, I think we both learnt a lot in the process and I can’t wait to apply what has been learnt in the new experience.
