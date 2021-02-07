"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
class APIError extends Error {
    constructor(data) {
        super();
        this.data = data;
    }
}
exports.APIError = APIError;
