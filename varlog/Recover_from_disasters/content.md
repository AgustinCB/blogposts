# Recover from disasters

So I did something stupid. About 6 months back, I got two new hard
disks for my laptop. In one, I installed basically the same setup that
I already had (Arch linux) but using BTRFS instead of EXT4. In the 
other, I installed Windows 10 through a virtual machine. I then
proceeded to swap the first disk with the main disk of my laptop and to
completely forget about the second one (because, you know, _Windows_).

Ten days ago, I started doing a tutorial on how to program games in C++
using Unreal. After suffering much with the Linux version, I took the 
disk with windows installed, used a "sata to usb" interface and boot it
on a virtual machine. After boot, I noticed that it didn't go to 
Windows, but to a grub install. I turned off the virtual machine and 
stopped to think: If it were using the disk that I had as my primary 
disk, it should have complained because it was already mounted and busy.
Therefore, it had to be that I confused disks and was using the old one
from my laptop. I decided then to just wipe it and install Windows
there (it's spreading!!!!). When I finished installing it, I noticed my
host system starting to behave strangely and I had a gut feeling that 
was quickly confirmed: I had installed Windows in my main disk, erasing
whatever was there before.

The first thing I did was quickly turning off the laptop and taking out
the disk, just to make sure I don't ruin things for good. Then, I 
installed the old disk with my operative system in EXT4 and made a list
of things that I could recover from the cloud and things that will need
to be recovered from the disk. I had two items in the second one: Some 
dirty changes made in a work repository that I never committed and the 
image of a vm that I was using to study for my OSCP certification. I 
had a version of that one in my old disk, but was month old.

Next thing I did was turn on the computer, install [TestDisk](https://www.cgsecurity.org/wiki/TestDisk)
and run it on the ruined disk. Fortunately, the application was able to
spot the previous BTRFS partition table and I could go back to it. Of 
course, that wasn't good enough: Those partitions and subvolumes were 
useless. It was barely able to mount the partition and failed to mount 
subvolumes. Both `btrfs check` and `btrfs repair` failed too.

Researching, I found a wonderful tool: [btrfs restore](http://man7.org/linux/man-pages/man8/btrfs-restore.8.html)
