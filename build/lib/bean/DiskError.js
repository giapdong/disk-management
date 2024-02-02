"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiskError extends Error {
    constructor(error) {
        super(error.message);
        this.name = this.constructor.name;
        this.message = error.message;
        this.expandErrorProperty(error);
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, DiskError);
    }
    expandErrorProperty(error) {
        const errorKeys = Object.keys(error).filter(key => key != "message");
        errorKeys.forEach((key) => (this[key] = error[key]));
    }
}
exports.default = DiskError;
