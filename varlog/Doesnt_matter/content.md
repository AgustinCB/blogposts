# Why the it doesn't matter what programming language you learn

Is very common, when someone is trying to learn software development, to fall into the habit of asking questions in ther order of:

- What's the best programming language for beginners?
- What's the fastest programming language?
- Should I learn ReactJS or AngularJS?
- What's the easiest programming language?
- What's the most productive IDE?
- Is Atom better than Visual Studio Code?
- Is Javascript better than PHP?
- What's the most vegan friendly programming language?

If you take a quick look at Quora or StackOverflow, you'll see tons of questions similar to those. In the same order, it won't take you long to all sort of articles comparing different technologies and giving advice in which is better for beginners.

However, in my opinion, all that doesn't matter.

The difference between AngularJS and ReactJS? So minimal that most websites won't notice the difference. What's the fastest programming language? Unless you want to develop AAA games, an operative system or a compiler... It doesn't matter. Most of the time the blottleneck is in your code and not in the language. The most productive IDE? The best code editor? It doesn't matter. The difference between them isn't noticiable at that stage and hardly ever is. Just pick one and stick to it till you're productive.

A similar response can be given to questions that try to compare programming languages: In most cases, it doesn't matter. Usually, when a (serious) company picks a programming language, they don't do it by choosing the one with the most features or the most engineered one. Otherwise we'd all be using LISP! When they pick a language, they base it in:

- How stable is. I don't want to invert money in a project that will use a language that has two months in the market and no third party library.
- The developers market. Haskell is an amazing language, but if I make my startup using it I'll have a very hard time finding developers for it.
- The support. I know that if I build my product in Golang and there's a serious issue in the compiler that may harm my business, Google will fix it. Similar note for other ones such as Kotlin, Java or C#.

None of these reasons include anything about how cool is, if it's two milliseconds faster than the competence or if it includes a unique and new feature noone else does.

And none of these reasons really matter for beginners. You don't need support, a complete repository of third party libraries or a market of developers.

On the other hand, if you learnt to program, which language you used is anecdotic.

## But then... what language should I learn?

My thumbs up rule: If the language is mainstream and without obvious design flaws, it's perfect to start.

### It should be mainstream

Unless you don't plan to work in the industry, you better learn a language that has a job market. Erlang is extremely pleasant, but you will have a very hard time finding jobs in that.

Go to your local ad site, check the work section and see what's demanded for software developers. Usually, you'll find things like Java, C, C#, Python, PHP, Javascript, Go or Scala if you're in tech hub. Anyone of those is a safe bet.

### It shouldn't have obvious design flaws

I'll get a lot of hate for this, but even with all I said, not all languages are the same. Some of the are.. aweful. Usually because of historical reasons and the need to keep backwards compatibility.

The thing is, if you start programming with PHP or Javascript is very likely that you will pick some bad habits. They have very obvious flags. Both [PHP][1] and [Javascript][2]. If you can, don't start with them.

Is very likely that you will have to learn them in the future, specially if you want to work on web development. Is also very likely that you will enjoy them. I won't admit it publicly, but I kinda like JS. Once you understand their werdnesses and you know what you're doing, they're just as good as any other.

But they're dangerous for beginners and the reason is...

### Types matters


Another thing I want to mention: Types are good. SPECIALLY for a beginner. An anecdote:

A couple years ago, a good friend of mine decided that he wanted to be a software developer and asked me for advice on where to start. Because is a common place, I told him that Python is a good enough pick (easy and with market).

He started learning it and now and then would ask me things as he went. Parallely, he started a course in Java. One day, he commented me:

"You know, I find Java much easier to follow. When I write a function, I know at the moment what's returning, what are the parameters and I don't need extra time to understand what's happening there."

When I advised him about using Python, I did thinking that it would be easier because he didn't have to worry about types. It turns out that Java was easier because he didn't have to worry about types: Instead of being implicit, they're explicit and he could see them from the beginning.

So, if you can, pick a typed language.

## A word of advice

Having said all that, I want to stress again: Which language in particular you choose, doesn't matter. Even if you don't follow any of my advices and decide to learn to program with a dynamically typed, unpopular and awful language (AppleScript, for example), if you focus on learning how to create software, it won't matter.

And that should be your aim: Don't try to become a Python Developer. Or a Java Expert. Try to become a software engineer. Instead of focusing on learning the best programming language as if it were your first language, focus on creating something.

Make a clone of one of the early versions of Facebook (a very achiable goal). Create a To-Do app for your phone. Create a blog. Whatever. Pick a real problem and solve it. That's much more valuable. And that will give you the skill set necessary to learn any programming language in a couple days.

The rest... Doesn't matter.

[1]: https://webonastick.com/php.html
[2]: https://medium.com/javascript-non-grata/the-top-10-things-wrong-with-javascript-58f440d6b3d8
