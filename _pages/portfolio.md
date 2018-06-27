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

Find this interesting? [Read more](unit/), read the [javadoc](https://ecen.github.io/unit/) or check out the [latest release](https://github.com/ecen/unit/).

## [An Overview of Introductory Data Structures](/assets/docs/datastrukturer_sammanfattning.pdf)
When writing a program, there is a wide variety of commonly used data structures and algorithms available. Having taken an introductory course to the subject, me and a friend decided to write a summary of it. The resulting document is **only available in swedish** and serves as a brief introduction to data structures. More specifically, it tries to concisely summarize the important points of the Chalmer's course *DAT037 Datastrukturer* as presented in 2017 and 2018.

The document is [available here](/assets/docs/datastrukturer_sammanfattning.pdf).

## A Concise Introduction to Concurrent Programming
Concurrent programming can be an important skill for any programmer. Much literature unfortunately delves too deeply into theory to effectively convey the quite intuitive basic concepts to the beginner. In this document, I try to do just that.

The document will be available on this site in the near future.