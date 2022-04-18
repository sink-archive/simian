import PatchChain from "./patchChainNode";

const getOriginal = (patchChain: PatchChain): Function =>
    typeof patchChain.prev === "function"
        ? patchChain.prev
        : getOriginal(patchChain.prev);

export default (patcherId: symbol, obj: any, funcName: string): Function => {
    const patchChain: PatchChain = obj[patcherId][funcName];
    if (patchChain === undefined) return obj[funcName];

    return getOriginal(patchChain);
};
