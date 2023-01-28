"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUnixData = void 0;
function parseUnixData(stdout) {
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
exports.parseUnixData = parseUnixData;
