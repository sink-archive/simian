let patchIds = new Set();
const generatePatchId = () => {
    let x = 0;
    while (patchIds.has(x)) x = Math.floor(Math.random() * 100000);

    patchIds.add(x);
    return x;
};

const remove = (obj, funcName, patchId) => {
    throw new Error("Not implemented yet");
};

export default class Patcher {
    _embeddedName;
    _id;
    _patchIds;

    constructor(embeddedName, id) {
        this._embeddedName = embeddedName;
        this._id = id;
        this._patchIds = new Set();
    }

    get patcherId() {
        return this._embeddedName.toUpperCase() + "_" + this._id;
    }

    after(funcName, obj, patch) {
        let orig = obj[funcName];
        if (orig === undefined || typeof orig !== "function")
            throw new Error(`${funcName} is not a function on ${obj}`);

        // closures go brrr
        const afterFunc = (...args) => {
            let ret = obj[funcName].apply(obj, args);
            ret = patch(args, ret) ?? ret;
            return ret;
        };

        const id = generatePatchId();

        if (obj[`_##_${this.patcherId}`] === undefined)
            obj[`_##_${this.patcherId}`] = new Map();

        let patchChain = obj[`_##_${this.patcherId}`].get(funcName);
        if (patchChain === undefined)
            patchChain = {
                id,
                prev: { func: orig },
                func: afterFunc,
                end: true,
            };
        else patchChain = { id, prev: patchChain, func: afterFunc, end: false };

        obj[`_##_${this.patcherId}`].set(funcName, patchChain);

        return () => remove(obj, funcName, id);
    }
}
