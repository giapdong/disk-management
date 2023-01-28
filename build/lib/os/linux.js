"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linux = void 0;
const DiskSystem_1 = __importDefault(require("../inheritable/DiskSystem"));
const helper = __importStar(require("./helper"));
class linux extends DiskSystem_1.default {
    readSystemPartition() {
        return new Promise(async (resolve, reject) => {
            try {
                const rawPartition = await this.spawnCommand("df", ["-Bk"]);
                const partitions = helper.parseUnixData(rawPartition);
                resolve(partitions);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.linux = linux;
