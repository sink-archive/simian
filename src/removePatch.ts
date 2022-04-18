import hijackingFunc from "./hijackingFunc";
import PatchChainNode from "./patchChainNode";

export default (
    obj: any,
    funcName: string,
    patchId: symbol,
    patcherId: symbol
) => {
    let patchChain: PatchChainNode = obj[patcherId][funcName];

    // travel down the chain to the correct node
    while (patchChain.id !== patchId) {
        if (typeof patchChain.prev === "function")
            throw new Error("patchchain ended unexpectedly");
        patchChain = patchChain.prev;
    }

    // if this is the most recent patch
    if (!patchChain.next) {
        // if this is the only patch on this func, remove all
        if (typeof patchChain.prev === "function") {
            obj[funcName] = patchChain.prev;
            delete obj[patcherId][funcName];
        } else {
            // the most recent patch, but not the only, so pop off the top node and fix the func
            obj[funcName] = hijackingFunc(patchChain.prev.func);
            obj[patcherId][funcName] = patchChain.prev;
        }
    } else {
        // this patch is not the most recent, so simply remove it from the chain and thats literally it
        patchChain.next.prev = patchChain.prev;
        if (typeof patchChain.prev !== "function")
            patchChain.prev.next = patchChain.next;
    }
};
