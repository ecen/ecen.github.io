---
title: "Portfolio"
author_profile: true
permalink: /portfolio/
---

## Dimensional Analysis and Modeling Library
This is a small java library that makes it easier to work with variables of different physical quantities. It does this by attaching physical quantities, units, to variables that it then uses to perform dimensional analysis on your calculations. It will for instance stop you from doing `2 m + 2 kg`, but will allow you to do `2 m * 2 kg = 4 kg*m`. It is also easy to create completely custom units, either from scratch or from some combination of other units. For convenience, many basic units are also pre-defined.

Here's an example of how to create new units from old ones.
```
// 1 my = 3 m
U myUnit = new U(U.M, 3, "my", "my unit");

// 1 mySq = 2 m^2
U mySq = new U(U.M.pow(2), 2, "mySq", "my square")

// 1 myCu = 1 my * 1 mySq = 3 m * 2 m^2 = 6 m^3
U myCu = new U(myUnit.mul(mySq), 1, "myCu", "my cubic")
```

Read the entire javadoc at [ecen.github.io/unit](https://ecen.github.io/unit/).

Find the latest release at [github.com/ecen/unit](https://github.com/ecen/unit/).