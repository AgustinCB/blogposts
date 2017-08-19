# Experimenting with Void Linux

Bored of working with client's and work's project, I decided to commit to a personal project. I have a couple laptops laying around that aren't being used for anything, so I thought I'd use them to start experimenting.

The first thing I have to do is set them up. I decided to take this chance to experiment el little bit. I prefer to use tested and stable technologies when working in someone else's project, but I don't mind to go crazy on my own. I have been reading about Void Linux and I decided to give it a chance and install it in the laptops.

## Why I chose Void Linux

There're a bunch of reasons. I was always a fun of Gentoo (I used it for years in University) and I have been using Arch lately. In general, I like the philosophy of freedom and control that this distros provide me. Void Linux has a similar idea behind, so that was my first selling point.

One of the things that has in common with Arch Linux is that is a rolling release distro, which I find very appealing. I never tried to use one in a server, so I thought it'd be a good moment to see the pros and cons.

The second selling point is Runit. I have had to use a bunch of different init systems: The old BSD method, upstart, systemd... We decided to start using Runit in my work and I found it very interesting: Simple and efficient.

The downside, however, is that it has a very small repository of applications. But that quickly became an opportunity: I wouldn't mind to learn how to create packages for Void and collaborate with them to the community. Experience a little bit how it feels to be a maintainer.

## The objective

I want a very simple set up for both machines: I want the minimal stuff to work (ssh, vim, administration tools) and a version of docker new enough to be able to configure a swamp to which I'd deploy the services of my project.
