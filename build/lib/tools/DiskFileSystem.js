"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DiskError_1 = __importDefault(require("../bean/DiskError"));
const ConsoleErrorHandler_1 = __importDefault(require("../bean/ConsoleErrorHandler"));
const zlib_1 = __importDefault(require("zlib"));
class DiskFileSystem {
    static async generateSafeFilePath(filepath) {
        if (fs_1.default.existsSync(filepath)) {
            var files = fs_1.default.readdirSync(path_1.default.dirname(filepath));
            var filename = path_1.default.parse(filepath).name;
            var fileext = path_1.default.parse(filepath).ext;
            var index = 0;
            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                let pattern = new RegExp(filename + "(\\s*\\((\\d+)\\)\\s*)?" + fileext);
                let match = file.match(pattern);
                if (match && match[2]) {
                    var idx = parseInt(match[2]);
                    if (idx > index) {
                        index = idx;
                    }
                }
            }
            index++;
            return path_1.default.join(path_1.default.dirname(filepath), `${filename} (${index})${fileext}`);
        }
        return filepath;
    }
    static async compressFile(data) {
        return zlib_1.default.deflateSync(Buffer.from(data), { level: zlib_1.default.Z_BEST_COMPRESSION });
    }
    static async extractFile(filepath) {
        var tiny_txt = fs_1.default.readFileSync(filepath);
        var restore = zlib_1.default.inflateSync(Buffer.from(tiny_txt), { level: zlib_1.default.Z_BEST_COMPRESSION });
        return restore;
    }
    lsCommandPromise(pathToDir) {
        return new Promise((resolve, reject) => {
            if (fs_1.default.existsSync(pathToDir)) {
                fs_1.default.readdir(pathToDir, "utf-8", function (err, data) {
                    return err ? reject(err) : resolve(data);
                });
            }
            else {
                resolve([]);
            }
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
            new ConsoleErrorHandler_1.default(new DiskError_1.default(error));
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
