import PatchChain from "./patchChain";
import removePatch from "./removePatch";

let patchIds = new Set();
const generatePatchId = () => {
    let x;
    while (!x || patchIds.has(x)) {
        x = Math.floor(Math.random() * 1e10);
    }

    patchIds.add(x);
    return x;
};

export default class Patcher {
    // why not allow the patcher to be called something other than simian?
    #embeddedName;
    #id; // unique per name

    #patches; // to cleanup all patches with

    constructor(embeddedName, id) {
        this.#embeddedName = embeddedName;
        this.#id = id;
        this.#patches = new Set();
    }

    get patcherId() {
        return this.#embeddedName.toUpperCase() + "_" + this.#id;
    }

    after(funcName, obj, patch) {
        let orig = obj[funcName];
        if (orig === undefined || typeof orig !== "function")
            throw new Error(`${funcName} is not a function on ${obj}`);

        // closures go brrr
        const afterFunc = (func, args) => {
            let ret = func.apply(obj, args);
            ret = patch(args, ret) ?? ret;
            return ret;
        };

        const id = generatePatchId();

        if (obj[`_$$_${this.patcherId}`] === undefined)
            obj[`_$$_${this.patcherId}`] = {};

        let patchChain = obj[`_$$_${this.patcherId}`][funcName];
        if (patchChain === undefined)
            patchChain = new PatchChain(id, orig, afterFunc);
        else patchChain = new PatchChain(id, patchChain, afterFunc);

        obj[`_$$_${this.patcherId}`][funcName] = patchChain;

        obj[funcName] = patchChain.data.func;

        return () => removePatch(obj, funcName, id, this.patcherId);
    }
}
