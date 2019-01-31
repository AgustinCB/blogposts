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
