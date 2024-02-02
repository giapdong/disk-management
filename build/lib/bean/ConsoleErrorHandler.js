"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../inheritable/ErrorHandler"));
class ConsoleErrorHandler extends ErrorHandler_1.default {
    constructor(error) {
        super(error);
        this.handler();
    }
    handler() {
        console.log(this.error);
    }
}
exports.default = ConsoleErrorHandler;
