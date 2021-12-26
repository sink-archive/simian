import PatchChain from "./patchChain";

const getOriginal = (patchChain: PatchChain): Function => {
    if (typeof patchChain.prev === "function") return patchChain.prev;

    return getOriginal(patchChain.prev);
};

export default (patcherId: string, obj: any, funcName: string): Function => {
    const patchChain: PatchChain = obj[`_$$_${patcherId}`][funcName];
    if (patchChain === undefined) return obj[funcName];

    return getOriginal(patchChain);
};