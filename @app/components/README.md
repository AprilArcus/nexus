# @app/components

A place to store shared React components; also demonstrates how to add a package
that Next.js depends upon.

## Compilation

Note that these components are not compiled to on-disk JS in the same way as the
other packages. `tsc -b` only generates types declarations into /types. This is
because we delegate responsibility for compiling the sources to Next.js, which
is opinionated about optimizing the dependency graph.
