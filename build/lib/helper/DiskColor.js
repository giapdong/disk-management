"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiskColor {
    static red(str) {
        return "\x1b[1m\x1b[31m" + str + "\x1b[39m\x1b[22m";
    }
    static green(str) {
        return "\x1b[1m\x1b[32m" + str + "\x1b[39m\x1b[22m";
    }
    static blue(str) {
        return "\x1b[1m\x1b[34m" + str + "\x1b[39m\x1b[22m";
    }
}
exports.default = DiskColor;
