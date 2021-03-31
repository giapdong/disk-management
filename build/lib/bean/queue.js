"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor() {
        this.data = new Array();
    }
    isEmpty() {
        return this.data.length == 0;
    }
    enqueue(newItem) {
        this.data = this.data.concat(newItem);
        return this.size();
    }
    dequeue() {
        return this.data.shift();
    }
    peek() {
        return !this.isEmpty() ? this.data[0] : undefined;
    }
    clear() {
        this.data = new Array();
    }
    size() {
        return this.data.length;
    }
}
exports.default = Queue;
