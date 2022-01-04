// importing @cumcord.patcher is not useful as the @cumcord import is shallow cloned

import initPatcher from "../src/index";

export default () => {
    const originalPatcher = cumcord.patcher;

    const newPatcher = initPatcher("Cumcord");
    // Simain doesnt do this, so just copy in CC's
    newPatcher.injectCSS = originalPatcher.injectCSS;

    // inject!
    window.cumcord.patcher = newPatcher;

    return {
        onUnload() {
            window.cumcord.patcher = originalPatcher;
        },
    };
};
