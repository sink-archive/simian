// linked-list-esque structure storing patches to make it easy to un/apply them
// prev is:
//  - a `PatchChain` if `end = false`
//  - a `function`   if `end = true`

export default class PatchChain {
    constructor(id, prev, func, end = false) {
        this.id = id;
        this.end = end;
        this.prev = prev;
        this.func = (...args) =>
            func(this.end ? this.prev : this.prev.func, args);
    }

    id;
    end;
    prev;
    func;
}
