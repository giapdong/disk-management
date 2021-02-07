"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const response_format_1 = __importDefault(require("response-format"));
function test(req, res) {
    res.json(response_format_1.default.success());
}
exports.test = test;
