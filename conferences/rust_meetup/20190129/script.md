# First slide

Hello, I am Agustin Chiappe Berrini, software developer at Auvik by day and rust fanboy by night.

# Second slide

In this talk, I will walk you through my development experience in one of my early projects in rust as an example of how to address common problems with the borrow checker and also an example on what not to do.

The project consisted in an emulator of the classic space invaders console, including a full emulator of the intel 8080 CPU. This is, by the way, an awesome project that I recommend to anyone interested in an accessible yet not trivial programming exercise or as a way to learn a new language.

While doing this, I faced a problem that took me a couple days completely solve in an idiomatic way. The root of the issue came from a poor understanding on how the borrow checker work and the stupid decision of not checking the documentation.

# Third slide

I won't enter in much details about the cpu, since it's outside of this talk, but I will explain enough for you to understand where I got blocked.

The space invaders console used an Intel 8080, a 8 bit register, 16 bit address cpu that was the predecesor of the famous Z80. To communicate with the rest of the hardware, instead of using memory maping (that is, sharing parts of the ram with specific hardware devices), it used I/O pports. Using the instructio `IN [port]` and `OUT [port]` you would read from the a port into the accumulator and write from the accumulator into a port respectively.

One of the long term objectives that I had was to be able to modify the console. That is, to create an emulator for "space invaders like" console, whose specific configuration wouldn't really exist. With that in mind, this was my first attempt:

# Forth slide

Some of you may already know why this won't work. For those who don't: The borrow checker will complain that I am using here a variable whose ownership I gave up here. It's fair. When I saw this, I noded, I went to The Book and came back with this solution after skiming one chapter.

# Fifth slide

This will kinda work. It compiles just fine, that's for sure. We are basically using a datastructure called "reference counter," we can think of it as a smart pointer that contains a counter to the number of places in which this counter is active. It only frees the memory when that number reaches zero. It's very useful when we want to "share" an object between multiple actors in the same scope. However, it has one shortcoming...

# Sixth slide

Now here I am trying to modify the structure that is contained in `Rc`. Because I read only one small paragraph in one chapter in the Book when I tried to solve this, I didn't notice that `Rc` works as read only. This is the kind of error that you'd get. So the next thing that I do is go back to the Book and look for a way to do this, but at the same time be able to modify the content. And I come back with this...

# Seventh slide

As you can see, I replaced all the references to `Rc` for reference to `RefCell`, understanding that `RefCell` works similarly to `Rc` but it let's you mutate the content of the smart pointer, which is exactly what I wanted. However, the compiler had a surprise for me...

# Eight slide

What a cryptic error message! Well, sadly it actually makes sense. You see, I thought that the parallel with `Rc` would still hold when speaking about trait objects. That is, that `RefCell` would understand that this was meant to be a pointer to a structure implementing an interface and not care about the actual implementation, but it turns out that it needs to know the size of the structure at compile time.

Well, I thought, then it's just a matter of adding a `Box` in the mix, RIGHT?

# Ninth slide

This is how my solution looked like now. I had high hopes for this. However...

At this point I was desperate. I didn't want to have to _read_ again, so I decided to look in Google how to create a mutating list of trait objects in Rust without loosing my mind. I found the solution in a dark corner of reddit and the type reads something like this...

# Tenth slide

Look at that monstruosity. If you think about it, it makes sense: It is a vector, of reference counted, mutable references to trait objects. But the signature is a nightmare. I admit I was somewhat disappointed, I mean, imagine you are a poor co-op  student who did Java and Scheme in university and see this in your first week of work. You'd probably understand few and less. It was a disappointing experience, because although I understood why this signature is necessary, it still felt wrong.

And that was, of course, because it was wrong. In the same reddit thread, there's the following message:

# Eleventh slide

Now isn't this interesting. This guy has a point: Instead of making the whole structure mutable, I could make mutable only the bits that you know... actually mutate. This has some downsides, though, in that now the methods of the structure that cause mutation won't be marked as `&mut self` in the signature. But we are willing to pay that if the prize is not using the previous mounstrosity.
