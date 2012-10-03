# ChangeLog #

## 0.1.2 - October 3, 2012 ##
* Fixed compose chaining not extracting end result.
* Removed simpleCompose used for internal reduce callback. Since this is called
so often, this reduces the cost of a composed function by about 1/3.
* Removed duplicate code, slight size reduction.

## 0.1.1 - September 29, 2012 ##
* Updated code docs to have correct closure type syntax.
* Moved min file to own dist folder.
* Small internal improvements.

## 0.1.0 ##
* Inital Release
