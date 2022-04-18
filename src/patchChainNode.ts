export default class PatchChainNode {
    prev: PatchChainNode | Function;
    next?: PatchChainNode;
    id: symbol;
    func: (ctx: unknown, args: unknown[]) => unknown;

    constructor(
        id: symbol,
        prev: PatchChainNode | Function,
        patch: (ctx: unknown, func: Function, args: unknown[]) => unknown
    ) {
        this.id = id;
        this.func = (ctx: unknown, args: unknown[]) =>
            patch(
                ctx,
                this.prev instanceof PatchChainNode
                    ? this.prev.func
                    : this.prev,
                args
            );

        this.prev = prev;
        if (this.prev instanceof PatchChainNode) this.prev.next = this;
    }
}