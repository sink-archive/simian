Testing a library like this isn't easy.

By hand won't cut it, but automated Unit Testing is a pain to setup.

Now imagine you need to unit test the fact that the values of `this` are correct evrywhere.
Yeah, not easy.

To fix this, let's leverage the [large existing amount](https://dump.cumcord.com) of Discord plugins
for the Cumcord client mod as testing material.

With the exception of `cumcord.pather.injectCSS`,
Simian shoud be capable of standing in for CC's patcher functions.
Hell they even have the same method signatures!

This plugin swaps out the patcher functions as long as it is loaded,
but will not break anything already using CC's patcher.

Similarly, any Simian patches remaining after the plugin unloads will remain intact.
This does mean that this plugin does not clean up fully after itself like a plugin should
(this could be done with `cleanupAll()`),
but it means you wont inadvertently unpatch something by unloading the plugin.
