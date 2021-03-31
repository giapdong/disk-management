"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.darwin = exports.parseData = void 0;
const child_process_1 = require("child_process");
const ASystem_1 = require("../inheritable/ASystem");
const spawnCommand = function (command, options) {
    return new Promise((resolve, reject) => {
        const ps = child_process_1.spawn(command, options);
        if (!ps || !ps.stdout) {
            const err = new Error("Cannot spawn command!");
            return reject(err);
        }
        let ret = "";
        ps.stdout.on("data", function (data) {
            ret = data.toString();
        });
        ps.on("error", function (err) {
            reject(err);
        });
        ps.on("close", function (code, signal) {
            resolve(ret);
        });
    });
};
function parseData(stdout) {
    const listRawPartition = stdout.split("\n").filter(Boolean);
    listRawPartition.shift();
    return listRawPartition.map(partition => {
        const arr = partition
            .replace(/\s+(\d+)/g, "\t$1")
            .replace(/\s+\//g, "\t/")
            .split(/\t/);
        const usedSize = parseInt(arr[2].replace(/k|K/g, "")) * 1024;
        const freespace = parseInt(arr[3].replace(/k|K/g, "")) * 1024;
        const size = freespace + usedSize;
        const caption = arr[5];
        return { caption, size, freespace };
    });
}
exports.parseData = parseData;
class darwin extends ASystem_1.DiskSystem {
    readSystemPartition() {
        return new Promise(async (resolve, reject) => {
            try {
                const rawPartition = await spawnCommand("df", ["-bk"]);
                const partitions = parseData(rawPartition);
                resolve(partitions);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.darwin = darwin;
