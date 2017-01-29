This is a follow up of [Gimme your best distro](https://agustincb.github.io/post/588e19a137973700128fbd67).

This is the plan that I have:

1. Construct the lfs temporary system and add to it nix.
2. Build the LFS system using nix.
3. Add all the packages that I need using nix.

In this post, I'll cover the first step.

## Install the LFS temporary system

The first step it's the easiest. Follow the [lfs instructions](http://www.linuxfromscratch.org/lfs/view/stable-systemd/index.html) still character 5 to have a basic toolchain installed in the temporary folder.

However, we will have to modify the instructions for two packages: bzip2 and perl. The reason: We need static linking.

### bzip2

Before following the steps in the instructions, do:

```
sed -i 's/CFLAGS=/CFLAGS=-fPIC/' Makefile
```

It just adds the `-fPIC` option into the compiler. That option will allow static binding.

After that keep going as usual.

### perl

New steps:

```
sh Configure -des -Dprefix=/tools -Dlibs='-lm -lcrypt -ldl'
make
make install
```

## Install NIX dependencies

Now we will need to install the nix dependencies to be able to compile the package manager. 

### sqlite

First, let's get [sqlite](https://www.sqlite.org/2016/sqlite-autoconf-3150200.tar.gz). And then:

```
./configure --prefix=/tools
make
make install
```

### pkg-config

Now we will need to install `pkg-config`. We should use the source already downloaded. In the folder of the package:

```
./configure --prefix=/tools --with-internal-glib --disable-compile-warnings --disable-host-tool --docdir=/tools/share/doc/pkgconfig
make
make install
```

### libidn

Now we should install [libidn](ftp://alpha.gnu.org/pub/gnu/libidn/libidn2-0.9.tar.gz).

```
./configure --prefix=/tools
make
make install
```

### Flex

From the sources.

```
./configure --prefix=/tools
make
make install
```

### Bison

From the sources.

```
./configure --prefix=/tools
make
make install
```

### OpenSSL

First, download [OpenSSL](https://github.com/openssl/openssl/archive/OpenSSL_1_1_0c.tar.gz).

```
./config --prefix=/tools
make
make test #optional
make install
```

### Libcurl

Download [libcurl](https://curl.haxx.se/download/curl-7.50.1.tar.gz).

```
./configure --prefix=/tools
make
make test
make install
```

And now, let's go to install the perl modules we need:

### ExtUtils-MakeMaker

Download [ExtUtils](https://cpan.metacpan.org/authors/id/B/BI/BINGOS/ExtUtils-MakeMaker-7.24.tar.gz). 

```
PREFIX=/tools /tools/bin/perl Makefile.PL
make
make install
```

### DBI

Download [DBI](https://cpan.metacpan.org/authors/id/T/TI/TIMB/DBI-1.636.tar.gz).

```
LINKTYPE=static PREFIX=/tools /tools/bin/perl Makefile.PL
make static
make Makefile.aperl
sed -i 's/-L\/usr\/local\/lib/-L\/tools\/lib/g' Makefile.aperl
sed -i 's/-L\/usr\/local\/include/-L\/tools\/include/g' Makefile.aperl
make -f Makefile.aperl perl
make -f Makefile.aperl inst_perlMAP_TARGET=perl
```

### DBD

Download [DBD](https://cpan.metacpan.org/authors/id/I/IS/ISHIGAKI/DBD-SQLite-1.54.tar.gz).

```
LINKTYPE=static PREFIX=/tools /tools/bin/perl Makefile.PL
make static
make Makefile.aperl
sed -i 's/-L\/usr\/local\/lib/-L\/tools\/lib -ldl/g' Makefile.aperl
sed -i 's/-I\/usr\/local\/include/-I\/tools\/include/g' Makefile.aperl
make -f Makefile.aperl perl
make -f Makefile.aperl inst_perlMAP_TARGET=perl
make install
```

### WWW:Curl

Download [WWW::Curl](https://cpan.metacpan.org/authors/id/S/SZ/SZBALINT/WWW-Curl-4.17.tar.gz).

```
LINKTYPE=static PREFIX=/tools /tools/bin/perl Makefile.PL
make static
make perl
make -f Makefile.aperl inst_perlMAP_TARGET=perl
make install
```
