"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stack {
    constructor() {
        this.data = new Array();
    }
    isEmpty() {
        return this.data.length == 0;
    }
    push(newItem) {
        this.data = this.data.concat(newItem);
        return this.size();
    }
    pop() {
        return this.data.pop();
    }
    peek() {
        return !this.isEmpty() ? this.data[this.data.length - 1] : undefined;
    }
    clear() {
        this.data = new Array();
    }
    size() {
        return this.data.length;
    }
}
exports.default = Stack;
