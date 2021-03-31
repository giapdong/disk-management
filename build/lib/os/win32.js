"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win32 = exports.castToPartitionNode = exports.parseData = exports.execCommand = void 0;
const child_process_1 = require("child_process");
const ASystem_1 = require("../inheritable/ASystem");
function execCommand(command) {
    return new Promise((resolve, reject) => {
        child_process_1.exec(command, (error, stdout) => {
            if (error)
                return reject(error);
            try {
                resolve(stdout);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.execCommand = execCommand;
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
class win32 extends ASystem_1.DiskSystem {
    readSystemPartition() {
        return new Promise(async (resolve, reject) => {
            const stdout = await execCommand("wmic logicaldisk get size,freespace,caption");
            const listPartition = parseData(stdout);
            resolve(listPartition);
        });
    }
}
exports.win32 = win32;
