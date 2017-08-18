# Handling nullable values with monad and functors in JS

Not so long ago, we spoke about [lazy evaluation](https://agustincb.github.io/post/Lazy%20Evaluation%20with%20Javascript). I mentioned in there that the data structure we were creating was actually a monad. I didn't mentioned it, but it's also a functor. I also said that what a monad is, why they're interesting and how to use them was a subject for a different article. And this is said article! I'll try to give a brief explanation to monads and functors in a practical way solving a very typical problem: Nullable values.

## The problem

Values that are nullable can be a headache in every single language. If you worked with the JVM, you sure saw the Throwable NullPointerException. If you worked with Javascript, you sure saw errors like "undefined is not a function".

This kind error appear when you have a value that may not be set and use it without checking if it is or not. It's a very annoying problem and can easily lead to tons of "if(value)" in order to prevent this kind of behaviour.

In functional programming (specially if we have static types), we use something called Monads and Functors to create an structure that provides an easy way to handle this values. In Haskell, said structure is called Maybe. In Scala, Option.

## What?

First I'd like to introduce some vocabulary: The concept of a container.

A container (or wrapper) is a data structure that stores a value (or group of values) and provides an interface to access it. For example, an Array, a Map, an Object... You get the idea.

### Functors

A functor is a container with one particular functionality: Given a user defined function that takes the type of the content of the container and returns something else, it will apply it to all the elements in the container and wrap the result in a (new) functor and return it.

Usually, in practical terms, we can think of functor as an interface that implements a map method. Let's see how that interface would look like:

```interface Functor<T> {
  content: T
  map<T1, F extends Functor<T1>> (modifier: (a: T) => T1): F
}
```

Arrays are a good example of functors.

### Monads

A monads is also a container that applies a function to its content. However, this function is a little bit different: Instead of accepting the element unwrapped, returning the modified value and leave the wrapping work to the data structure, it will accept the unwrapped value, wrap it in a (new) monad and return that back.

Did you ever used Promise? Did you ever chained Promise? Then you used Monads.

```return Promise.resolve(1)
  .then(v => Promise.resolve(2))
  .then(v => Promise.resolve(3))
  .catch(e => console.log(e));
```

That's a Monad in action! In this case, we pass the function using the method then. Another languages call that method flatMap or bind. For consistency, we will use the first alternative and say that a Monad is any object that implements this interface:

```interface Monad<T> {
  content: T
  then<T1, M extends Monad<T1>> (modifier: (a: T) => M): M
}
```

## How?

Let's start coding!

```interface Functor<T> {
  content: T
  map<T1, F extends Functor<T1>> (modifier: (a: T) => T1): F
}
interface Monad<T> {
  content: T
  then<T1, M extends Monad<T1>> (modifier: (a: T) => M): M
}

class Option<T> extends Monad<T>, Functor<T> {
  content: T
  
  constructor (content?: V) {
    this.content = content
  }

  isDefined(): boolean {
    return this.content !== null && this.content !== undefined
  }

  nonDefined(): boolean {
    return !this.isDefined()
  }

  then<V1> (modifier: (a: V) => Option<V1>): Option<V1> {
    if (this.nonDefined()) {
      return Option.none()
    }
    return modifier(this.content)
  }

  map<V1> (modifier: (a: V) => V1): Option<V1> {
    return this.then(a => Option.unit(modifier(a)))
  }

  public static unit<V> (value?: V): Option<V> {
    return new Option(value)
  }

  public static none(): Option<any> {
    return new Option(null)
  }
}
```

As you can see, I represented a defined value as something that is different than null and undefined. At the same time, if the monad isn't defined, both then and map will always return a non defined Option.

The implementation, as you can see, is very simple and easy to understand. However... We may need a little bit more to see how this is useful.

## Why?

I won't try to argue why to use it, because I will fail. I'll let the code talk, instead.

First, let me add a little bit to our structure to make it more practical a less theorical.

```class Option<T> extends Monad<T>, Functor<T> {
  // ...
  get(): V {
    return this.content
  }

  getOrElse(defaultValue: V): V {
    return this.isDefined() ? this.content : defaultValue
  }

  filter (check: (a: V) => boolean): Option<V> {
    if (this.nonDefined() || !check(this.content)) {
      return Option.none()
    }
    return new Option(this.content)
  }

  foreach (action: (a: V) => void): Option<V> {
    if (this.isDefined()) {
      action(this.content)
    }
    return this
  }

  orElseDo (action: () => void): Option<V> {
    if (this.nonDefined()) {
      action()
    }
    return this
  }
  // ...
}
```

And now, suppose the following case:

We are building a webserver. We have a function that will receive an object with the headers of a request, a key of the expected header and return an Option with the value of the header or nothing if it wasn't present.

```javascript
interface Headers {
  [key: string]: string
}
const getHeader = (h: Headers, key: string): Option<string> => {
  if (h[key]) return Option.some(h[key])
  return Option.none()
}
```

Now, let's suppose that we're creating a middleware that will handle authentication. We are expecting that every request that passes through this middleware will have an Authorization header with the value "Token ${someToken}" where someToken is a JWT token signed by us.

How to do this with options?

```interface JWTHelper {
  validate: (t: string): boolean
  extract: (t: string): Option<{user_id: number, username: string}>
}
const JWT = <JWTHelper> require('some-jwt-library')

interface Request {
  headers: Headers
}
interface Response {
  setStatus: (s: number) => void
  send: (t: string) => void
}
interface Handler {
  (req: Request, res: Response, next: Handler) => void
}

const TokenHeaderRegex = /^Token (.+)/g
const auth = (req: Request, res: Response, next: Handler): void => {
  getHeader(req.headers) // Let's get the header!
    .filter(h => h.match(TokenHeaderRegex)) // Let's accept only headers in the expected format
    .map(h => h.replace(TokenHeaderRegex, '$1')) // And now we extract the token
    .filter(t => JWT.validate(t)) // Is it a valid token?
    .then(t => JWT.extract(t)) // And now extract the information in the token
    .foreach(u => { // If all went right, authenticate and go to the next step
      req.user = u
      next(req, res, next)
    })
    .orElseDo(() => { // If something went wrong, send 403
      res.sendStatus(403)
      res.send('you shall not pass')
    })
}
```

(Note that JWT.extract returns on Option with the user object expected or nothing if the token had no user specified values).

Isn't that simple? In about ten lines of code, we handled all the cases that we needed without having to worry about nulls or undefined. Although the logic in this function is very condition ("is the header empty?", "is in the right format?", "is the token valid?"), there's no if and at the same time, we can be sure that we access the value only when they're valid. Because we are using small functions for the filters and maps, it's easy to test them and probe they correctness.

How can we ask for more?

You experiment with this at this [Github repository](https://github.com/AgustinCB/npm-monad) or through this [npm package](https://www.npmjs.com/package/npm-monads)
