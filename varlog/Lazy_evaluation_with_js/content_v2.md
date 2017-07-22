"Functional programming" is becoming a fuzzword. There's tons of posts on tons of blogs about why it's the ultimate way to develop software. One of the reasons often cited is lazy evaluation. Javascript has the fame of being functional, but it lacks a native way to do most of the stuff commonly considered as such. Again, one of those is lazy evaluation. In this article I'll try to explain what is lazy that, why is a cool thing and how to use while programming in Javascript.

## What

Also referred as call-by-need (as opposed of call-by-name), is an strategy that delays the evaluation of an expression until its needed. It also remembers the value of the expression in order to avoid repeated evaluations.

## Why

Suppose this code:

```const someValue = expensiveFunction();
... // Tons of other operations that don't involve someValue, including user interactions
console.log(someValue);
```

As it is, expensiveFuntion will be executed executed first. Then a bunch of unrelated expressions, include the creation of a user interface. At the very end of the program, and for the first time, we use someValue (the result of expensiveFunction) to print it in the terminal.

So we ran a very demanding function at the beginning to use its returned value at the end of the program. If expensiveFunction were a CPU bounded function, we would have interfered in the user experience, probably blocking the browser.

Of course, in this small simple example one can avoid this problem by simply reordering the stuff:

```... // Tons of other operations that don't involve someValue, including user interactions
console.log(expensiveFunction());
```

And now we are executing the function when we need it. However, life isn't always that easy! In complex projects we may need to reference someValue in other parts of which we don't have control and we may not be able to know when the value will be needed first.

Now suppose we have a magic keyword in Javascript called lazy. If you add lazy at the beginning of a declaration statement, the value of the variable declared won't be executed still it's needed. Now we have that this is equivalent to our second code:

```lazy const someValue = expensiveFunction();
... // Tons of other operations that don't involve someValue, including user interactions
console.log(someValue);
```

Tada! Now we solved the two problems. expensiveFunction isn't being executed still the end and we defined the constant someValue at the beginning, so in case we need to reference it in any other place, we can do it safely.

### Repeated evaluation

A good question may raise from this example: If the variable is referenced twice... Would it be executed twice? In other words, would expensiveFunction run two times in this example?

```lazy const someValue = expensiveFunction();
... // Tons of other operations that don't involve someValue, including user interactions
console.log(someValue);
... // Other stuff
console.log(someValue);
```

The answer is no. And the reason is memoization: The technique of caching in memory a value calculated previously.

Although lazy evaluation and memoization aren't the same thing, they usually come together. When we refer to the first one, we're usually referring to the second one too. This case is a good example: Our imaginary keyword will "remember" the value of someValue after is performed for the first time. And if it's needed later again, it will return that instead of calculating it again. We REALLY don't want to run expensiveFunction twice.

## How

Unfortunatelly, we don't have a magic keyword named lazy in javascript. But we have closures and first class functions and that's more than enough.

```export default const lazy = function (creator) {
  let res;
  let processed = false;
  return function () {
    if (processed) return res;
    res = creator.apply(this, arguments);
    processed = true;
    return res;
  };
};
```

This is a very simple implementation of the requirements that hardly needs more explanation. Let's try a simple example to see how it works:

```let counter = 0;
const lazyVal = lazy(() => {
  counter += 1;
  return 'result';
});
console.log(counter); // 0
console.log(lazyVal()); // result
console.log(counter); // 1
console.log(lazyVal()); // result
console.log(counter); // 1
```

Wow, that was easy, wasn't it. We have now a way to create lazy variables. We have also a way to referenciate to these variables without evaluation them (using lazyVal) and another one to evaluate them (calling lazyVal()).

And although this meets the minimum requirements, it's far away from being perfect. The problem that we will have is that there's no way to tell if a variable is lazy! In small pieces of code that's not a problem, but when you have a project with thousands of files each one with hundred of lines, keeping track of the type of the variables is difficult, even if we comment frequently.

But that's not all: If we're using typescript, we just lost the type of the variable! Now the compiler will think that lazyVal is Function (which technically is) and we will miss a lot of valuable compile time validation.

So let's increase our requirements. In addition to all the above, we will:

- I want to be able to check, at runtime, if a variable is lazy.
- If I'm using Typescript, I want to be able to tell the compiler that the variable is lazy in addition with the type of it.

And that bring us to iteration number two of our solution. From now on, I will use typescript to make everything more evident. For those not familiar with it, keep in mind that is just a superset of Javascript. If you ignore all the type references, you would have good old EcmaScript 2016:

```export interface Lazy<T> {
  (): T;
  isLazy: boolean;
};
export default const lazy = <T>(getter: () => T): Lazy<T> => {
  let evaluated: boolean = false;
  let _res: T = null;
  const res = <Lazy<T>>function (): T {
    if (evaluated) return _res;
    _res = getter.apply(this, arguments);
    evaluated = true;
    return _res;
  }
  res.isLazy = true;
  return res;
};
```

That's better! Now I'd be able to let the compiler check if a variable is lazy or not and the type of said variable. And if I use plain javascript, I can check at runtime using isLazy.

### Operations

We are in a good spot. However, there's something we're missing: We need a way to operate with lazy values. Sure, we can do something like this:

```const actualVal1 = lazyVal1();
const actualVal2 = lazyVal2();
console.log(actualVal1 + actualVal2)
```

But that's not very cool! We're evaluating everything on the spot. And if we want the operation itself to be lazy, we would need to do something like:

```const newVal = lazy(() => {
  const actualVal1 = lazyVal1();
  const actualVal2 = lazyVal2();
  return actualVal1 + actualVal2;
});
```

Which is very ugly. Also, as soon as we need to chain more than one operation, this will become a very hard to understand (and maintain) code.

So we need a way to operate with lazy values and if possible, to chain these operations easily.

Our first try would be to add to the interface a function with this signature:

```then<T1>(modifier: (a: T) => Lazy<T1>): Lazy<T1>;
```

This function will recieve a modifier, run that modifier on our current value and return the result. A modifier, in this context, is an operation performed over the value of the lazy variable that returns a new different lazy variable. For those who didn't know it, by implementing that function we would be converting our Lazy structure into a Monad. What is a monad, why they are awesome and how to use them is a subject for a completely different article.

All this may sounds a little bit confusing. As a very smart man once said, "talking is cheap, show me the code!":

```export interface Lazy<T> {
  (): T;
  isLazy: boolean;
  then<T1>(modifier: (a: T) => Lazy<T1>): Lazy<T1>;
};
export default const lazy = <T>(getter: () => T): Lazy<T> => {
  let evaluated: boolean = false;
  let _res: T = null;
  const res = <Lazy<T>>function (): T {
    if (evaluated) return _res
    _res = getter.apply(this, arguments);
    evaluated = true;
    return _res;
  }
  res.then = <T1>(modifier: (a: T) => Lazy<T1>): Lazy<T1> => modifier(res());
  res.isLazy = true;
  return res;
};
```

Although this is a little bit better, it's still very confusing. So let's add an example of how to use it:

```let counter = 0;
const lazyVal = lazy(() => {
  counter += 1;
  return 1;
});
const lazyOp = lazyVal
  .then((v1) => lazy(() => {
    counter += 1;
    return v1 + 1;
  }));
console.log(counter); // 1
console.log(lazyOp()); //  2
console.log(counter); // 2
console.log(lazyOp()); //  2
console.log(counter); // 2
```

The good things about this implementation are: The operation is lazy and it that allow us to chain operations easily:

```const lazyOp = lazyVal
  .then((v1) => lazy(() =>
    v1 + 1;
  ))
  .then((v1) => lazy(() =>
    v1 * 8
  ));
```

Very easy, indeed. The bad part of this implementation, though, is that it's a little bit verbosy (why do I need to type lazy every single time?) and that the original lazy value gets evaluated as soon as we call the then function and no when we actually need the value (i.e. in the operation itself), as you can see looking at the outputs in the first example.

That's a very unfortunate, in fact. We want to delay the evaluation of the original lazy value as much as possible. Preferably, when the operation itself is executed.

So we need a better interface to make operations. In order to decide which once to implement, we have to think about our Lazy as if it's a container of a value. What do we do when we want to modify a container, such as an Array? Very simple: We map it. We want to do the same in this case. To do so, we will add a new definition to our interface:

```map<T1>(modifier: (a: T) => T1): Lazy<T1>;
```

That kind of method would allow us to reduce the verbosity of our program (we don't need to return a lazy structure in the function) and also to delay the evaluation as much as possible, as you will see in the following implementation:

```export interface Lazy<T> {
  (): T;
  then<T1>(modifier: (a: T) => Lazy<T1>): Lazy<T1>;
  map<T1>(mapper: (a: T) => T1): Lazy<T1>;
  isLazy: boolean;
};
const lazy = <T>(getter: () => T): Lazy<T> => {
  let evaluated: boolean = false;
  let _res: T = null;
  const res = <Lazy<T>>function (): T {
    if (evaluated) return _res
    _res = getter.apply(this, arguments);
    evaluated = true;
    return _res;
  }
  res.isLazy = true;
  res.then = <T1>(modifier: (a: T) => Lazy<T1>): Lazy<T1> => modifier(res());
  res.map = <T1>(mapper: (a: T) => T1): Lazy<T1> => lazy(() => mapper(res()));
  return res;
};
export default lazy;
```

See what we did there? We are returning a new lazy value in the map itself. This allow us the define the content of it before hand, placing all the execution there and ensuring that we delay the evaluation. Let's see an example of this:

```let counter = 0;
const lazyVal = lazy(() => {
  counter += 1;
  return 1;
});
const lazyOp = lazyVal.map(v => {
  counter += 1;
  return v + 1;
});
console.log(counter); // 0
console.log(lazyOp()); //  2
console.log(counter); // 2
console.log(lazyOp()); //  2
console.log(counter); // 2
```

That's much better! If you see, the first time we printed counter we received zero, an indicator that the evaluation didn't happen yet! But what about chaining operations?

```const lazyOp = lazy(expensiveFunction)
  .map((v1) => v1 + 1)
  .map((v1) => v1 * 8)
  .map(someOtherExpensiveFunction);
```

That's some sexy code.

Now we have very a handy and easy to use library for lazy evaluation in javascript, that can be applied in real world applications safely. If you're interested in the code, you can check the [github repository](https://github.com/AgustinCB/lazy-eval) or the [npm package](https://www.npmjs.com/package/lazy-eval).

In my next article about functional programming and javascript, I'll speak about monads and how to improve your coding experience with them.
