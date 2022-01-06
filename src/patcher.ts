import getOriginal from "./getOriginal";
import PatchChain from "./patchChain";
import removePatch from "./removePatch";

type PatchType = "AFTER" | "BEFORE" | "INSTEAD";

export default class Patcher {
    #id; // unique globally among every single object in the JS runtime

    #patched; // to cleanup all patches with

    constructor(embeddedName = "simian") {
        this.#id = Symbol(embeddedName);
        this.#patched = new Set<any>();

        // partial application moment
        // see, the functional programming people
        // do know how to have good clean code!
        this.after = this.#patch("AFTER");
        this.before = this.#patch("BEFORE");
        this.instead = this.#patch("INSTEAD");
    }

    after;
    before;
    instead;

    #patch(t: PatchType) {
        return (funcName: string, obj: any, patch: Function) => {
            const orig: Function = obj[funcName];
            if (typeof orig !== "function")
                throw new Error(`${funcName} is not a function on ${obj}`);

            // prepare to patch
            const id = Symbol();

            if (obj[this.#id] === undefined) obj[this.#id] = {};

            // create patch func
            let patchFunction: (
                ctx: unknown,
                func: Function,
                args: unknown[]
            ) => unknown;
            switch (t) {
                case "AFTER":
                    patchFunction = (ctx, func, args) => {
                        let ret = func.apply(ctx, args);
                        const newRet = patch.apply(ctx, [args, ret]);
                        if (typeof newRet !== "undefined") ret = newRet;
                        return ret;
                    };

                    break;

                case "BEFORE":
                    patchFunction = (ctx, func, args) => {
                        let finalArgs = args;
                        const newArgs = patch.apply(ctx, [args]) ?? args;
                        if (Array.isArray(newArgs)) finalArgs = newArgs;
                        return func.apply(ctx, finalArgs);
                    };
                    break;

                case "INSTEAD":
                    patchFunction = (ctx, func, args) =>
                        patch.apply(ctx, [args, func.bind(ctx)]);
                    break;
                default:
                    break;
            }

            // add to patch chain
            let patchChain: PatchChain = obj[this.#id][funcName];
            if (patchChain === undefined)
                patchChain = new PatchChain(id, orig, patchFunction);
            else patchChain = new PatchChain(id, patchChain, patchFunction);

            obj[this.#id][funcName] = patchChain;

            // inject patch!
            //obj[funcName] = patchChain.data.func;
            obj[funcName] = function () {
                return patchChain.data.func(this, ...arguments);
            };

            // i read thru Cumcord patcher src to find this one lol
            // attach original function props to patched function
            Object.assign(obj[funcName], orig);

            this.#patched.add(obj);

            return () => removePatch(obj, funcName, id, this.#id);
        };
    }

    cleanupAll() {
        for (const obj of this.#patched) {
            for (const funcName in obj[this.#id]) {
                const orig = getOriginal(this.#id, obj, funcName);
                obj[funcName] = orig;
                obj[this.#id][funcName] = undefined;
            }

            obj[this.#id] = undefined;
            delete obj[this.#id];
        }
        this.#patched.clear();
    }
}
