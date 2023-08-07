"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeParent = exports.getBigDirectoryFromRootHierachy = exports.writeResultToFile = exports.removeParentInHierachy = exports.scanBigDirectoryInHierachy = exports.scanInFileSystem = void 0;
const fs_1 = __importDefault(require("fs"));
const DiskFileSystem_1 = __importDefault(require("../tools/DiskFileSystem"));
const Hierachy_1 = __importDefault(require("../bean/Hierachy"));
const DiskError_1 = __importDefault(require("../bean/DiskError"));
const DiskColor_1 = __importDefault(require("../helper/DiskColor"));
const ConsoleErrorHandler_1 = __importDefault(require("../bean/ConsoleErrorHandler"));
const interface_1 = require("../interface");
const global_helper_1 = require("../helper/global-helper");
const scanner_1 = __importDefault(require("../engine/scanner"));
async function scanInFileSystem(rootPath) {
    const spinner = global_helper_1.genDotsSpinner('[1/4] Scanning');
    spinner.start();
    const HierachyTree = new Hierachy_1.default(null, rootPath, 0, interface_1.TypeNodeHierachy.Directory);
    var scanner = new scanner_1.default(HierachyTree, spinner);
    await scanner.run();
    spinner.info(`Total storage: ${global_helper_1.bytesToSize(HierachyTree.storage)}`);
    spinner.succeed('[1/4] Scanning');
    return HierachyTree;
}
exports.scanInFileSystem = scanInFileSystem;
async function scanBigDirectoryInHierachy(rootHierachy, threshold) {
    const spinner = global_helper_1.genDotsSpinner('[2/4] Scanning big directory');
    spinner.start();
    const listBigNode = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
    spinner.info(`[2/4] ${listBigNode.length} directory contrain total file file size >= ${threshold}`);
    spinner.succeed('[2/4] Scanning big directory');
    return listBigNode;
}
exports.scanBigDirectoryInHierachy = scanBigDirectoryInHierachy;
async function removeParentInHierachy(rootHierachy) {
    const spinner = global_helper_1.genDotsSpinner('[3/4] Formatting data');
    spinner.start();
    removeParent(rootHierachy);
    spinner.succeed('[3/4] Formatting data');
    return rootHierachy;
}
exports.removeParentInHierachy = removeParentInHierachy;
async function writeResultToFile(scanDir, pathJSON, obj) {
    const spinner = global_helper_1.genDotsSpinner('[4/4] Writting result');
    spinner.start();
    try {
        if (!fs_1.default.existsSync(scanDir))
            fs_1.default.mkdirSync(scanDir);
        await new DiskFileSystem_1.default().writeFilePromise(pathJSON, JSON.stringify(obj));
        spinner.info(DiskColor_1.default.green('Finish!') + ' Saved 1 new log file.');
        spinner.succeed('[4/4] Writting result');
    }
    catch (error) {
        new ConsoleErrorHandler_1.default(new DiskError_1.default(error));
        spinner.info('Failed! Write file log return with Error');
        spinner.fail('[4/4] Writting result');
    }
}
exports.writeResultToFile = writeResultToFile;
function getBigDirectoryFromRootHierachy(rootNode, threshold) {
    const result = new Array();
    recursiveScanBigDirectory(result, rootNode, threshold);
    return result;
}
exports.getBigDirectoryFromRootHierachy = getBigDirectoryFromRootHierachy;
function removeParent(root) {
    root.parent = null;
    root.child.forEach(child => {
        child.parent = null;
        if (child.type == interface_1.TypeNodeHierachy.Directory)
            removeParent(child);
    });
}
exports.removeParent = removeParent;
function recursiveScanBigDirectory(arrayResult, rootNode, threshold) {
    let tempStroge = 0;
    rootNode.child.forEach(child => {
        if (child.type === interface_1.TypeNodeHierachy.File)
            tempStroge += child.storage;
        else
            recursiveScanBigDirectory(arrayResult, child, threshold);
    });
    if (tempStroge > threshold) {
        arrayResult.push({ path: rootNode.name, storage: tempStroge });
    }
}
