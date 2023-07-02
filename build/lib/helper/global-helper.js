"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDotsSpinner = exports.getDateByFormat = exports.bytesToSize = void 0;
const ora_1 = __importDefault(require("ora"));
function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0 || isNaN(bytes))
        return "n/a";
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024));
    if (i === 0)
        return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]} (${bytes.toLocaleString()} ${sizes[0]})`;
}
exports.bytesToSize = bytesToSize;
function getDateByFormat() {
    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
    let date = ("00" + now.getDate()).slice(-2);
    let hour = ("00" + now.getHours()).slice(-2);
    let minutes = ("00" + now.getMinutes()).slice(-2);
    let second = ("00" + now.getSeconds()).slice(-2);
    return `${year}-${month}-${date}_${hour}.${minutes}.${second}`;
}
exports.getDateByFormat = getDateByFormat;
function genDotsSpinner(text) {
    return ora_1.default({
        text: text,
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        }
    });
}
exports.genDotsSpinner = genDotsSpinner;
