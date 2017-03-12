I'm trying to learn Haskell. While I'm enjoying the process and I'm about to become a fan of static and strong typing, I'm having a very common problem to gasp the idiomatics of the language: monads.

In order to understand it better and get a good idea about it, I decided to do three things:

1. Read the famous paper [Monads for functional programming](http://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf).
2. Implement the explanation in a language I'm very familiar with (in this case, Javascript).
3. Write a blog post trying to explain that concept.

The objective for me it's to internalise it.

## Why?

I think that's the first phase every programmer passes through when learning Haskell. "Why the hell would you use this thing instead of just normal stuff?" Or something like that.

To be able to justify monads, we have to understand a very important idea:

In Haskell, purity is sacred. That means that every computation should return always the same value each time it's invoked. 

While that's beautiful in theory, in practice is a little inconvenient. What do we do if we want to pick a random number? Or to fire exceptions if a web service isn't available? Or to do something that requires input from the external world (user, current time, whatever)?

Monads were thought as a way to keep Haskell pure and at the same time be able to handle all these cases, called normally "side effects."

## What?

Monad is a concept borrowed from category theory. I'll try to explain the basis of it. And yes, I know, everybody hates mathematics. But I don't and this is my blog.

So a monad on a category is an endofunctor (functor with same start and end category) with two transformations called return (a transformation whose result is a monad that returns the start) and bind (a transformation that takes two monads a returns another one).

<!-- Put here an image with the latex representation -->
