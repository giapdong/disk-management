"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.win32 = exports.castToPartitionNode = exports.parseData = void 0;
const DiskSystem_1 = __importDefault(require("../inheritable/DiskSystem"));
function parseData(stdout) {
    const parsed = stdout
        .trim()
        .split("\n")
        .slice(1)
        .map(line => {
        return line.trim().split(/\s+(?=[\d/])/);
    });
    const listPartition = parsed.map(partition => castToPartitionNode(partition));
    return listPartition;
}
exports.parseData = parseData;
function castToPartitionNode(partition) {
    const caption = partition[0];
    const freespace = parseInt(partition[1]);
    const size = parseInt(partition[2]);
    return { caption, freespace, size };
}
exports.castToPartitionNode = castToPartitionNode;
class win32 extends DiskSystem_1.default {
    readSystemPartition() {
        return new Promise(async (resolve, reject) => {
            try {
                const stdout = await this.spawnCommand("wmic", ["logicaldisk", "get", "size,freespace,caption"]);
                const listPartition = parseData(stdout);
                resolve(listPartition);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.win32 = win32;
