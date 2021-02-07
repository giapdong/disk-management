"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseToPartitionNode = exports.readPartition = void 0;
const child_process_1 = require("child_process");
function readPartition() {
    return new Promise(async (resolve, reject) => {
        var _a;
        const getPartition = child_process_1.exec("wmic logicaldisk get deviceid, freespace, size");
        (_a = getPartition.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
            let rawDataPartition = data.split("\r\r\n").filter((item) => item);
            let tablePartition = rawDataPartition.map((item) => item.trim().split(/\s+/gm));
            let headerTable = tablePartition.length ? tablePartition.shift() : [];
            headerTable = headerTable ? headerTable : [];
            headerTable = headerTable.map((item) => item.toLowerCase());
            let listPartition = new Array();
            tablePartition.forEach((partition) => {
                let temp = Object.fromEntries(partition.map((value, index) => {
                    return [headerTable[index], value];
                }));
                let node = caseToPartitionNode(temp);
                if (node)
                    listPartition.push(node);
            });
            resolve(listPartition);
        });
    });
}
exports.readPartition = readPartition;
function caseToPartitionNode(partition) {
    if (!Object.prototype.hasOwnProperty.call(partition, "deviceid"))
        return null;
    if (!Object.prototype.hasOwnProperty.call(partition, "freespace"))
        return null;
    if (!Object.prototype.hasOwnProperty.call(partition, "size"))
        return null;
    if (isNaN(+partition.freespace))
        return null;
    if (isNaN(+partition.size))
        return null;
    let node = { deviceid: partition.deviceid, freespace: +partition.freespace, size: +partition.size };
    return node;
}
exports.caseToPartitionNode = caseToPartitionNode;
