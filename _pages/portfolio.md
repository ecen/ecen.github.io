---
title: "Portfolio"
author_profile: true
permalink: /portfolio/
---

## [Dimensional Analysis Library: Unit](unit/)
A small **Java library** that makes it easier to work with and **convert** variables with different units. It makes sure you only perform valid operations while also allowing you to define entirely custom units. Here is a small example:

```java
U myUnit = new U(U.M, 3, "my", "my unit"); // 1 my = 3 meters
UV x = new U(5, myUnit); // x = 5 my
System.out.println(x.convert(U.YARD)); // Prints "16.40 yard"
```

Find this interesting? [Read more](unit/), read the [javadoc](https://ecen.github.io/unit/) or check out the [latest release](https://github.com/ecen/unit/).

## [An Overview of Introductory Data Structures](/portfolio/data-structures/)
A document summarizing the important points of *DAT037 Datastrukturer*, a Chalmer's introductory course to data structures. **Only available in Swedish.**

[Read more](/portfolio/data-structures/) about it or [download the pdf](/assets/docs/datastrukturer_sammanfattning.pdf).

## A Primer to Concurrent Programming
Concurrent programming is a useful skill for any programmer. Unfortunately, the subject is often presented with heavy theory in a way that makes the core concepts difficult to distinguish. This document aims to present some of the most important concepts and how they relate to concurrency, so that it is easier to understand and value the theory when you hear it.

Here you can download the [Primer to Concurrent Programming](/assets/docs/Primer_to_Concurrent_Programming.pdf) pdf.

## Hardware and Software Optimization for Gaussian Elimination
As part of the Chalmer's course *EDA332 Datorsystemteknik* me and a friend where tasked with writing and optimizing MIPS assembly code for performing matrix triangulation, the first part of Gaussian elimination. Our solution managed a second place in the course competition for creating the most efficient solution with an efficiency score of 554 µsC$.

Checkout the [repository](https://github.com/ecen/eda332-computer-system-engineering) or read the [report](https://github.com/ecen/eda332-computer-system-engineering/blob/master/report/Optimizing_Hardware_and_Software_for_Gaussian_Elimination.pdf).