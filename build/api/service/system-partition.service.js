"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemPartition = void 0;
const response_format_1 = __importDefault(require("response-format"));
const index_1 = require("../../lib/index");
async function getSystemPartition(req, res) {
    let data = await index_1.readSystemPartition();
    res.json(response_format_1.default.success("Get info partition success", data));
}
exports.getSystemPartition = getSystemPartition;
