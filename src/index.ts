import { after, before, instead } from "spitroast";

const patchesMap = new WeakMap<Simian, (() => boolean)[]>();

const addPatch =
  <T>(self: Simian, patchFunc: (...args: T[]) => () => boolean) =>
  (...args: T[]) => {
    const patch = patchFunc(...args);
    patchesMap.get(self).push(patch);
    return patch;
  };

export default class Simian {
  constructor() {
    patchesMap.set(this, []);
  }

  cleanupAll() {
    patchesMap
      .get(this)
      .reverse()
      .forEach((patch) => patch());
  }

  after: typeof after = addPatch(this, after);
  before: typeof before = addPatch(this, before);
  instead: typeof instead = addPatch(this, instead);
}
