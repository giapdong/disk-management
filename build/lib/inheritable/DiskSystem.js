"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class DiskSystem {
    spawnCommand(command, options) {
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
    }
}
exports.default = DiskSystem;
