# Experimenting with Void Linux

Bored of working with client's and other persons' project, I decided to commit to one of my crazy ideas. I have a couple laptops laying around that aren't being used for anything, so I thought I'd use them to start experimenting.

The first thing I had to do is set them up. I decided to take this chance to experiment a little bit. I prefer to use tested and stable technologies when working in someone else's project, but I don't mind to go crazy on my own. I have been reading about this thing called Void Linux and I decided to give it a chance and install it in the laptops.

## Why I chose Void Linux

There're a bunch of reasons. I was always a fun of Gentoo (I used it for years in University) and I have been using Arch lately. In general, I like the philosophy of freedom and control that this distros provide me. Void Linux has a similar idea behind, so that was my first selling point.

One of the things that has in common with Arch Linux is that is a rolling release distro, which I find very appealing. I never tried to use one in a server, so I thought it'd be a good moment to see the pros and cons.

The second selling point is Runit. I have had to use a bunch of different init systems: The old BSD method, upstart, systemd... We decided to start using Runit in my work and I found it very interesting: Simple and efficient.

The downside, however, is that it has a very small repository of applications. But that quickly became an opportunity: I wouldn't mind to learn how to create packages for Void and collaborate with them to the community. Experience a little bit how it feels to be a maintainer.

## The objective

I want a very simple set up for both machines: I want the minimal stuff to work (ssh, vim, administration tools) and a version of docker new enough to be able to configure a swamp to which I'd deploy the services of my project. If it's possible, I'd love a very low maintenance setup.

## The process

So I wanted to install Void from my machine. To do so, I opened my laptops, take out their hard disks, used a Sata-to-USB wire and followed the steps in the Void wiki about [how to install Void alongside Arch Linux](https://wiki.voidlinux.eu/Installing_alongside_Arch_Linux). I had to make a couple adjustments, because I don't want to install Void alongside Arch Linux, I want to install Void from my Arch Linux.

And therefore the steps I folllowed were:

- Partition the disks. I created two partitions, one for `/` and another one for `/mnt`. The first one with 10G of space, the other one with the rest of the disk. I did it using gparted because I love that program, but it really doesn't matter at all. I decided to use btrfs, but ext4 could work just as nicely.

- My next step was to install the Void Package Manager from AUR. No mistery there:

```bash
yaourt -S xbps-git
```

Here is where I faced the first problem :). If you see the comments in the package, you'll notice that an upgraded version of openssl is conflicting with the one used in the package. The conflict is actually very stupid: Is handling every `deprecated` as an error. The new version of openssl decrepacted a function that is being called in xbps. So it failes to build because of that error!

However, Arch has an awesome community and in the same comment in which they report the problem, they provide a solution. Isn't that nice? `yaourt` gives you the chance to modify the `PKGBUILD` file on every package. You just need to say `yes` and add the following two lines before the `./configure` step:

```bash
export LDFLAGS="$LDFLAGS -L/usr/lib/openssl-1.0"
export CFLAGS="$CFLAGS -I/usr/include/openssl-1.0"
```

That solve the original error... But then others appeared!

```
fetch/ftp.c: In function ‘ftp_mode_type’:
fetch/ftp.c:444:8: error: this statement may fall through  -Werror=implicit-fallthrough=]
   type = 'D';
   ~~~~~^~~~~
fetch/ftp.c:445:2: note: here
  case 'D':
  ^~~~
fetch/ftp.c: In function ‘ftp_request’:
fetch/ftp.c:342:3: error: missed loop optimization, the loop counter may overflow [-Werror=unsafe-loop-optimizations]
   for (i = 0; i <= len && i <= end - dst; ++i)
   ^~~
fetch/ftp.c:342:24: error: missed loop optimization, the loop counter may overflow [-Werror=unsafe-loop-optimizations]
   for (i = 0; i <= len && i <= end - dst; ++i)
               ~~~~~~~~~^~~~~~~~~~~~~~~~~
cc1: all warnings being treated as errors
make[1]: *** [Makefile:62: fetch/ftp.o] Error 1
make[1]: Leaving directory '/tmp/yaourt-tmp-agustin/aur-xbps-git/src/xbps/lib'
make: *** [Makefile:15: all] Error 1
```

All of them seem little code optimizations that were configured to be treated as errors. Because they seem like harmless warnings, I decided to do the following:

```bash
export LDFLAGS="$LDFLAGS -L/usr/lib/openssl-1.0"
export CFLAGS="$CFLAGS -I/usr/include/openssl-1.0 -Wno-error=implicit-fallthrough= -Wno-error=unsafe-loop-optimization -Wno-error=format-truncation="
```

That seemed to do the trick. Note that I added `format-truncation=` also in the list. That's another warning that gave me problems in the build.

This was a very painful step, to be fair. And it made me curious. What were these warnings about? Where they... important? It's never a good idea to shut up the compiler when it's complaining (what we did here). So I decided to go to the repository of XBPS, try to build the application and see if I could reproduce.

And I could. It turns out that the project was tested under GCC 4.X and I was using GCC 7. Because it was configured to treat every warning as an error (an excellent idea) and GCC 7 introduced new warnings that weren't available in the version 4, it failed when I tried to compile.

The second step would be to check if they were valid complains. And, I suspect, they were. You can see a pull request with the changes I made in this [PR](https://github.com/voidlinux/xbps/pull/254). Because I didn't want to use a version of the program those insecure accesses to memory, I decided that I'd redo the process using my fork of the program. At least, till I get some feedback in the pull request. With that, I decided to start by uninstalling the package and install it again:

```bash
yaourt -Rs xbps-git
yaourt -S xbps-git
```

This time, while editing the `PKGBUILD`, I'd do two changes: Specify the new OpenSSL version to use and modify the `url` and `source` variables to point to `https://github.com/AgustinCB/xbps` instead of `https://github.com/voidlinux/xbps`.

And that worked just fine :).
