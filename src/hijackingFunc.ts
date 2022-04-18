// takes a function expecting (the value of `this`, args[]) and turns it into a normal function

export default (func: (ctxt: unknown, args: unknown[]) => unknown) =>
    function (...args: unknown[]) {
        return func(this, args);
    };
