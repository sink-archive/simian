const getOriginal = (patchChain) => {
    if (typeof patchChain.prev === "function") return patchChain.prev;

    return getOriginal(patchChain.prev);
};

export default (patcherId, obj, funcName) => {
    const patchChain = obj[`_$$_${patcherId}`][funcName];
    if (patchChain === undefined) return obj[funcName];

    return getOriginal(patchChain);
};
