---
title: "Portfolio"
author_profile: true
permalink: /portfolio/
toc: true
#sidebar:
   #nav: "portfolio"
---

## [Dimensional Analysis Library](unit/)

A small **Java library** that makes it easier to work with and **convert** variables with different units. It makes sure you only perform valid operations while also allowing you to define entirely custom units. Here is a small example:

```java
U myUnit = new U(U.M, 3, "my", "my unit"); // 1 my = 3 meters
UV x = new U(5, myUnit); // x = 5 my
System.out.println(x.convert(U.YARD)); // Prints "16.40 yard"
```

Find this interesting? [Read more](unit/), read the [javadoc](https://ecen.github.io/unit/) or check out the [repository](https://github.com/ecen/unit/).

## [Data Structures Overview](/portfolio/data-structures/)

A document summarizing the important points of *DAT037 Datastrukturer*, a Chalmer's introductory course to data structures. **Only available in Swedish.**

[Read more](/portfolio/data-structures/) about it or download the pdf [with hyperlinks](/assets/docs/datastrukturer_sammanfattning.pdf) or [for printing](/assets/docs/datastrukturer-printing-version.pdf).

## Concurrent Programming Primer

Concurrent programming is a useful skill for any programmer. This document aims to present some of the most important concepts of the subject so that it is easier to understand and value the underlying theory.

[Download the pdf](/assets/docs/Primer_to_Concurrent_Programming.pdf).

## Gaussian Elimination

As part of the Chalmer's course *EDA332 Datorsystemteknik* we were tasked with writing MIPS assembly for performing matrix triangulation. Our solution managed a second place in the course competition for the most efficient solution with an efficiency score of 554 µsC$.

Checkout the [~repository~](https://github.com/ecen/eda332-computer-system-engineering)(currently made private on request from course supervisor) or read the [report](/assets/docs/Optimizing_Hardware_and_Software_for_Gaussian_Elimination.pdf).
