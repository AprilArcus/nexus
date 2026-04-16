# @app/lib

Various utilities, mostly React hooks.

## Compilation

Note that these components are not compiled to on-disk JS in the same way as the
other packages. `tsc -b` only generates types declarations into /types. This is
because we delegate responsibility for compiling the sources to Next.js, which
is opinionated about optimizing the dependency graph.
