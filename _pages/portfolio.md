---
title: "Portfolio"
author_profile: true
permalink: /portfolio/
---

## [Dimensional Analysis Library: Unit](unit/)
This is a small Java library that makes it easier to work with variables modeling physical quantities. It does this by attaching physical quantities, units, to variables in order to perform dimensional analysis. It will stop you from doing undefined operations like `2 m + 2 kg`, but allow legal ones like `2 m * 2 kg = 4 kg*m`. It is also easy to define entirely custom units.

Here are a few examples:
```java
// 1 my = 3 m
U myUnit = new U(U.M, 3, "my", "my unit");

// 1 mySq = 2 m^2
U mySq = new U(U.M.pow(2), 2, "mySq", "my square");

// 1 myCu = 1 my * 1 mySq = 3 m * 2 m^2 = 6 m^3
U myCu = new U(myUnit.mul(mySq), 1, "myCu", "my cubic");
```

Find this interesting? Read more about the [Dimensional Analysis Library: Unit](https://ecen.github.io/portfolio/unit/), read the [javadoc](https://ecen.github.io/unit/) or check out the [latest release](https://github.com/ecen/unit/).

## An Overview of Introductory Data Structures
Having taken an introductory course on data structures in 2017 I decided to transcribe my notes into LaTeX before my exam. This proved useful the following year when a good friend of mine took the same course. I asked my friend if he would care to see if he found my notes useful and if so, if there was anything I had missed. There was and we decided to put some time in writing up and summarizing as much as we could of the course.

This document aims to be a concise representation of an introductory course to data structures. It lists and explains many important concepts and data structures but doesn't delve into further theory, for which you should rather find a relevant book.

The document will be available on this site in the near future.

## A Concise Introduction to Concurrent Programming
Concurrent programming can be an important skill for any programmer. Much literature unfortunately delves too deeply into theory to effectively convey the quite intuitive basic concepts to the beginner. In this document, I try to do just that.

The document will be available on this site in the near future.