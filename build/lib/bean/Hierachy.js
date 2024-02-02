"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
class Hierachy {
    constructor(parent, name, storage, type) {
        this.parent = parent;
        this.name = name;
        this.storage = storage;
        if (type == interface_1.TypeNodeHierachy.File) {
            this.fsize = storage;
        }
        else {
            this.fsize = 0;
        }
        this.type = type;
        this.child = [];
    }
    addStorage(value, increaseFile = false) {
        this.storage += value;
        if (increaseFile) {
            this.fsize += value;
        }
        if (this.parent)
            this.parent.addStorage(value);
    }
}
exports.default = Hierachy;
