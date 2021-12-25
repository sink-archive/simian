import PatchChain from "./patchChain";

let patchIds = new Set();
const generatePatchId = () => {
    let x = 0;
    while (patchIds.has(x)) x = Math.floor(Math.random() * 100000);

    patchIds.add(x);
    return x;
};

const remove = (obj, funcName, patchId, patcherId) => {
    throw new Error("Not implemented yet");
};

export default class Patcher {
    // why not allow the patcher to be called something other than simian?
    _embeddedName;
    _id; // unique per name
    _patchIds; // stores all patch IDs

    constructor(embeddedName, id) {
        this._embeddedName = embeddedName;
        this._id = id;
        this._patchIds = new Set();
    }

    get patcherId() {
        return this._embeddedName.toUpperCase() + "_" + this._id;
    }

    after(funcName, obj, patch) {
        debugger;
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

        if (obj[`_##_${this.patcherId}`] === undefined)
            obj[`_##_${this.patcherId}`] = {};

        let patchChain = obj[`_##_${this.patcherId}`][funcName];
        if (patchChain === undefined)
            patchChain = new PatchChain(id, orig, afterFunc, true);
        else patchChain = new PatchChain(id, patchChain, afterFunc);

        obj[`_##_${this.patcherId}`][funcName] = patchChain;

        obj[funcName] = patchChain.func;

        return () => remove(obj, funcName, id, this.patcherId);
    }
}
