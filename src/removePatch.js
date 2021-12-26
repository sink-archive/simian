// this is honestly probably the worst function in this lib, but removing from a (non doubly) linked list be like
export default (obj, funcName, patchId, patcherId) => {
    debugger;
    const patchChain = obj[`_##_${patcherId}`][funcName];

    // most recent patch - first in the chain
    if (patchChain.data.id === patchId) {
        if (typeof patchChain.prev === "function") {
            // the only patch left,
            // so set the func back to original & delete the chain
            obj[funcName] = patchChain.prev;
            obj[`_##_${patcherId}`][funcName] = undefined;
            return;
        }

        // pop off the top of the patch chain
        obj[`_##_${patcherId}`][funcName] = patchChain.prev;
        // fix func
        obj[funcName] = patchChain.prev.data.func;
        return;
    }

    // singly linked list node remove, how fun
    // https://www.tutorialspoint.com/remove-elements-from-singly-linked-list-in-javascript
    // dont ask me how this works or what the hell recursiveTransform does, idk
    const recursiveTransform = (list) => {
        if (list && typeof list.prev === "object") {
            list.data = list.prev.data;
            list.prev = list.prev.prev;
            return recursiveTransform(list.prev);
        } else return true;
    };
    const removeNode = (list) => {
        // end reached & no match
        if (!list) throw new Error("could not find unpatch");

        if (typeof list.prev === "object" && list.data.id !== patchId)
            return removeNode(list.prev);
        return recursiveTransform(list);
    };
};
