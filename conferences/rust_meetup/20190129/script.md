# First slide

Hello, I am Agustin Chiappe Berrini, software developer at Auvik by day and rust fanboy by night.

# Second slide

In this talk, I will walk you through my development experience in one of my early projects in rust as an example of how to address common problems with the borrow checker and also an example on what not to do.

The project consisted in an emulator of the classic space invaders console, including a full emulator of the intel 8080 CPU. This is, by the way, an awesome project that I recommend to anyone interested in an accessible yet not trivial programming exercise or as a way to learn a new language.

While doing this, I faced a problem that took me a couple days completely solve in an idiomatic way. The root of the issue came from a poor understanding on how the borrow checker work and the stupid decision of not checking the documentation.

# Third slide

I won't enter in much details about the cpu, since it's outside of this talk, but I will explain enough for you to understand where I got blocked.
