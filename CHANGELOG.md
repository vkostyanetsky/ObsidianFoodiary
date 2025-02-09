# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.2.4 - 2025-02-09

### Added

* Calorie goal value that you can change in the plugin setting will be displayed in the code block (thanks to @l-t-k!)

## 1.2.3 - 2024-04-15

### Changed

* Removed a behaviour which was making the codeblock inoperable if a product property was not a number.

## 1.2.2 - 2024-04-14

### Added

* "Show product folder titles" setting makes you see original product names seen, as they set in code block.
* "Group entries by titles" setting which allows a user to disable automatic grouping if they needs to.

### Changed

* Fixed a bug due to which empty `aliases` property of a note in products folder was making the codeblock inoperable.

## 1.2.1 - 2024-04-07

### Changed

* Fixed a bug due to which identical products in the code block were not collapsed into one.

## 1.2.0 - 2024-04-07

### Added

* The code block now shows error if a product` property type is not number.
* Now it is possible to set product' aliases and use them in a code block.

### Changed

* Made products search case insensitive (for example, "apple" now matches with "Apple").

## 1.1.0 - 2024-03-30

### Added

* You can now use mathematical expressions instead of specifying the exact weight of food (for instance, "Donuts 100+120+120", "Apples 200*2", etc.).

## 1.0.1 - 2024-03-28

### Changed

* Applied sentence case to code block title for missing products.

## 1.0.0 - 2024-03-21

### Added

* Basic calculation of nutritional value of the food a user eats.