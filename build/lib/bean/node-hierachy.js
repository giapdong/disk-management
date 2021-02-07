"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hierachy = void 0;
class Hierachy {
    constructor(parent, name, storage, type) {
        this.parent = parent;
        this.name = name;
        this.storage = storage;
        this.type = type;
        this.child = [];
    }
    addStorage(value) {
        this.storage += value;
        if (this.parent)
            this.parent.addStorage(value);
    }
}
exports.Hierachy = Hierachy;
