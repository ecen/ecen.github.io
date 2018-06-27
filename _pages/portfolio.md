---
title: "Portfolio"
author_profile: true
permalink: /portfolio/
---

## [Dimensional Analysis Library: Unit](unit/)
A small **Java library** that makes it easier to work with variables modeling physical quantities. It makes sure you only perform valid operations and it also allows you to define entirely custom units. Here is a small example:

```java
U myUnit = new U(U.M, 3, "my", "my unit"); // 1 my = 3 meters
UV x = new U(5, myUnit); // x = 5 my
System.out.println(x.convert(U.YARD)); // Prints "16.40 yard"
```

Find this interesting? [Read more](unit/), read the [javadoc](https://ecen.github.io/unit/) or check out the [latest release](https://github.com/ecen/unit/).

## [An Overview of Introductory Data Structures](/portfolio/data-structures/)
A document summarizing the important points of *DAT037 Datastrukturer*, a Chalmer's introductory course to data structures. **Only available in swedish.**

[Read more](/portfolio/data-structures/) about it or [download the pdf](/assets/docs/datastrukturer_sammanfattning.pdf).

## A Concise Introduction to Concurrent Programming
Concurrent programming can be an important skill for any programmer. Much literature unfortunately delves too deeply into theory to effectively convey the quite intuitive basic concepts to the beginner. In this document, I try to do just that.

The document will be available on this site in the near future.