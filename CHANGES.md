# Changelog

## 2.0.1
- Can't I even write a wrapper properly????

## 2.0.0
- Deprecate and thin wrap spitroast

## 1.5.2
- Fix npmignore ignoring all but one dist file

## 1.5.1
- Update CHANGES.md

## 1.5.0
- Refactor patchchain
- Better CJS support

## 1.4.5

-	Add licence

## 1.4.2

-   Keywords.

## 1.4.1

-   General code cleanup (thanks functional programming people for partial application <3)

## 1.4.0

-   Switched to symbols for ID generation
-   Made removePatch clean up after itself a slight bit more, but not yet fully. cleanupAll can clean up properly, however
-   Added CHANGES.md
-   removed unnecessary files from the npm package
-   replaced `initPatcher` default export with the `Patcher` class

## 1.3.0

-   Fix the value of `this` inside both patches and the original function being incorrect

## 1.2.0

-   Fix a typedef

## 1.1.3

-   Add README

## 1.1.2

-   Added `main` key to package.json to fix the package being unusable

## 1.1.1

-   Move to tsc for the main builds instead of esbuild (esbuild lives on for bundling for dev testing)

## 1.1.0

-   Move to TypeScript

## 1.0.0

-   Initial release
