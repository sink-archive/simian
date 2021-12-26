import getOriginal from "./getOriginal";
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

    #patched; // to cleanup all patches with

    constructor(embeddedName, id) {
        this.#embeddedName = embeddedName;
        this.#id = id;
        this.#patched = new Set();
    }

    get patcherId() {
        return this.#embeddedName.toUpperCase() + "_" + this.#id;
    }

    #patch(t, funcName, obj, patch) {
        const orig = obj[funcName];
        if (orig === undefined || typeof orig !== "function")
            throw new Error(`${funcName} is not a function on ${obj}`);

        // prepare to patch
        const id = generatePatchId();

        if (obj[`_$$_${this.patcherId}`] === undefined)
            obj[`_$$_${this.patcherId}`] = {};

        // create patch func
        let patchFunction;
        switch (t) {
            case "AFTER":
                patchFunction = (func, args) => {
                    let ret = func.apply(obj, args);
                    ret = patch(args, ret) ?? ret;
                    return ret;
                };

                break;
            case "BEFORE":
                patchFunction = (func, args) => {
                    const newArgs = patch(args) ?? args;
                    return func.apply(obj, newArgs);
                };
                break;
            case "INSTEAD":
                patchFunction = (func, args) => patch(args, func.bind(obj));
                break;
            default:
                break;
        }

        // add to patch chain
        let patchChain = obj[`_$$_${this.patcherId}`][funcName];
        if (patchChain === undefined)
            patchChain = new PatchChain(id, orig, patchFunction);
        else patchChain = new PatchChain(id, patchChain, patchFunction);

        obj[`_$$_${this.patcherId}`][funcName] = patchChain;

        // inject patch!
        obj[funcName] = patchChain.data.func;

        this.#patched.add(obj);

        return () => removePatch(obj, funcName, id, this.patcherId);
    }

    after(funcName, obj, patch) {
        return this.#patch("AFTER", funcName, obj, patch);
    }

    before(funcName, obj, patch) {
        return this.#patch("BEFORE", funcName, obj, patch);
    }

    instead(funcName, obj, patch) {
        return this.#patch("INSTEAD", funcName, obj, patch);
    }

    cleanupAll() {
        for (const obj of this.#patched) {
            for (const funcName in obj[`_$$_${this.patcherId}`]) {
                const orig = getOriginal(this.patcherId, obj, funcName);
                obj[funcName] = orig;
                obj[`_$$_${this.patcherId}`][funcName] = undefined;
            }

            obj[`_$$_${this.patcherId}`] = undefined;
            delete obj[`_$$_${this.patcherId}`];
        }
        this.#patched.clear();
    }
}
