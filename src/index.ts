import { after, before, instead } from "spitroast";

const patchesMap: { [k: symbol]: (() => boolean)[] } = {};
const addPatch =
  <T>(id: symbol, patchFunc: (...args: T[]) => () => boolean) =>
  (...args: T[]) => {
    const patch = patchFunc(...args);
    patchesMap[id].push(patch);
    return patch;
  };

export default class {
  id = Symbol();

  cleanupAll() {
    patchesMap[this.id].reverse().forEach((patch) => patch());
    delete patchesMap[this.id];
  }

  after: typeof after = addPatch(this.id, after);
  before: typeof before = addPatch(this.id, before);
  instead: typeof instead = addPatch(this.id, instead);
}
