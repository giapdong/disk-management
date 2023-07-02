"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DiskFileSystem {
    lsCommandPromise(pathToDir) {
        return new Promise((resolve, reject) => {
            fs_1.default.readdir(pathToDir, "utf-8", function (err, data) {
                return err ? reject(err) : resolve(data);
            });
        });
    }
    async readStatDirPromise(pathToDir, dirInfo) {
        try {
            const promise = dirInfo.map(element => {
                return this.readStatPromise(path_1.default.join(pathToDir, element));
            });
            let dirNodes = await Promise.all(promise);
            dirNodes = dirNodes.filter(item => {
                if (item.stats.isSymbolicLink()) {
                    return false;
                }
                return true;
            });
            return dirNodes;
        }
        catch (error) {
            DiskFileSystem.handleError("readStatDirPromise", error);
            const newDirInfo = dirInfo.filter(item => path_1.default.join(pathToDir, item) != error.path);
            if (!newDirInfo.length)
                return [];
            return await this.readStatDirPromise(pathToDir, newDirInfo);
        }
    }
    writeFilePromise(path, data, options = "utf-8") {
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(path, data, options, error => {
                return error ? reject(error) : resolve(1);
            });
        });
    }
    async readStatPromise(pathToNode) {
        return new Promise((resolve, reject) => {
            fs_1.default.lstat(pathToNode, function (err, data) {
                const nodeStat = { path: pathToNode, stats: data };
                return err ? reject(err) : resolve(nodeStat);
            });
        });
    }
    static handleError(prefix, error) {
        if (error.code == "ENOTDIR" || error.errno == -20) {
        }
        else if (error.code == "ELOOP" || error.errno == -40) {
        }
        else if (error.code == "ENOENT" || error.errno == -2) {
        }
        else if (error.code == "EBUSY" || error.errno == -4082) {
        }
        else if (error.code == "EACCES" || error.errno == -4092) {
        }
        else {
            console.log("\n", prefix, error);
        }
    }
}
exports.default = DiskFileSystem;
