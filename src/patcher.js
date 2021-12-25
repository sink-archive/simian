function removePatch(patcher, obj, patchId) {}

export default class Patcher {
    _embeddedName;
    _id;
    _patchIds;

    constructor(embeddedName, id) {
        this._embeddedName = embeddedName;
        this._id = id;
        this._patchIds = new Set();
    }

    get patcherId() {
        return this._embeddedName.toUpperCase() + "_" + this._id;
    }
}
