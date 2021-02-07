"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFilePromise = exports.readStatDirPromise = exports.lsCommandPromise = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function lsCommandPromise(pathToDir) {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(pathToDir, "utf-8", function (err, data) {
            return err ? reject(err) : resolve(data);
        });
    });
}
exports.lsCommandPromise = lsCommandPromise;
async function readStatDirPromise(pathToDir, dirInfo) {
    try {
        let promise;
        promise = dirInfo.map(element => {
            return readStatPromise(path_1.default.join(pathToDir, element));
        });
        return await Promise.all(promise);
    }
    catch (error) {
        console.log(error);
        let newDirInfo = dirInfo.filter(item => path_1.default.join(pathToDir, item) != error.path);
        if (!newDirInfo.length)
            return [];
        let listStat = await readStatDirPromise(pathToDir, newDirInfo);
        return listStat;
    }
}
exports.readStatDirPromise = readStatDirPromise;
function writeFilePromise(path, data, options = "utf-8") {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(path, data, options, error => {
            return error ? reject(error) : resolve(1);
        });
    });
}
exports.writeFilePromise = writeFilePromise;
async function readStatPromise(pathToNode) {
    return new Promise((resolve, reject) => {
        fs_1.default.stat(pathToNode, function (err, data) {
            let nodeStat = { path: pathToNode, stats: data };
            return err ? reject(err) : resolve(nodeStat);
        });
    });
}
