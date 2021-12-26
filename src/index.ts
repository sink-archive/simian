import Patcher from "./patcher";

const patchers = new Map();

const getId = () => Math.floor(Math.random() * 1e10);

export default function initPatcher(embeddedName = "simian") {
    let id = getId();
    if (Array.isArray(patchers.get(embeddedName)))
        while (patchers.get(embeddedName).indexOf(id) !== -1) id = getId();

    patchers.set(embeddedName, (patchers.get(embeddedName) ?? []).concat(id));
    return new Patcher(embeddedName, id);
}

// @ts-ignore
//window.patcher = initPatcher();