"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARouter = void 0;
const express_1 = __importDefault(require("express"));
class ARouter {
    constructor(name) {
        this.router = express_1.default.Router();
        this.name = name;
        this.registerRouters();
    }
    getName() {
        return this.name;
    }
    getRouter() {
        return this.router;
    }
}
exports.ARouter = ARouter;
