---
title: "Dimensional Analysis Library: Unit"
author_profile: true
permalink: /projects/unit/
description: "Java library for performing dimensional analysis and working with variables modeling physical quantities. It is possible to define entirely custom units. Typing is enforced with java exceptions. Library correctness enforced by junit tests."
thumbnail: /projects/unit/thumbnail.png
---

# Dimensional Analysis Library: Unit
This is a small Java library that makes it easier to work with variables modeling physical quantities. It does this by attaching physical quantities, units, to variables in order to perform dimensional analysis. It will stop you from doing undefined operations like `2 m + 2 kg`, but allow legal ones like `2 m * 2 kg = 4 kg*m`. It is also easy to define entirely custom units.

## Basic Usage
There are mainly two classes that you will have to use, **U** and **UV** . `U` defines a unit and `UV` defines a unit with a value. Both classes support similar arithmetic operations like `add`, `mul`, `div` and `pow`. All operations returns a new `U` or `UV` object that represents the result of the operation, allowing operations to be chained.

Here are two examples of these operations showcasing operations on existing units and creating new ones. The pre-defined units `U.KG`, `U.M` and `U.S` represents kilograms, meters and seconds, respectively.
```java
U newton = U.KG.mul(U.M).div(U.S.pow(2));
System.out.println(newton); // Prints "kg * m / s^2".

UV f = new UV(5, newton).add(new UV(3, newton));
System.out.println(f); // Prints "8.00 kg * m / s^2".
```

It is also possible define new units from scratch. If we wanted to define Newton as above, but give it a proper name, we can do like this:
```java
U newton = new U(U.KG.mul(U.M).div(U.S.pow(2)), 1, "N", "Newton");
UV f = new UV(5, newton).add(new UV(3, newton));

System.out.println(f); // Prints "8.00 N".
System.out.println(f.convert(U.KG.mul(U.M).div(U.S.pow(2)))); // Prints "8.00 kg * m / s^2".
```

This defines a unit called Newton with the abbreviation N. The number 1 signifies the length compared to the reference unit. If we for wanted to define kilo-Newton, we would write give it a length of 1000 compared to Newton.

## Creating Entirely New Units

A unit may be defined from scratch using the `Quantity` class. This class represents a raw physical quantity and a power. For instance, DISTANCE with power 2 would represent an area. The raw physical quantity is as of writing this accessed through the 'Base' enum, but it should in the future be possible to define your own as well.

As an example, this is how Meter is defined internally:
```java
U M = new U(1, "m", "meter", new Quantity(Base.DISTANCE, 1));
```

One thing to note is that the first 1 here is the absolute length that will be used in the internal representation of this unit and could essentially be any number. The length given to units defined on meter is in relative terms to this number.


## Release and Documentation
If you think this is something you would like to use, you can download the library from its git repo or read the full java documentation.

Read the [javadoc](https://ecen.github.io/dimensional-analysis/).

Find the latest release on [github](https://github.com/ecen/dimensional-analysis/).
