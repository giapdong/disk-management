"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeParent = exports.getBigDirectoryFromRootHierachy = exports.scanHierachyNode = exports.writeResultToFile = exports.removeParentInHierachy = exports.scanBigDirectoryInHierachy = exports.scanInFileSystem = void 0;
const fs_1 = __importDefault(require("fs"));
const DiskFileSystem_1 = __importDefault(require("../tools/DiskFileSystem"));
const Hierachy_1 = __importDefault(require("../bean/Hierachy"));
const DiskError_1 = __importDefault(require("../bean/DiskError"));
const DiskColor_1 = __importDefault(require("../helper/DiskColor"));
const ConsoleErrorHandler_1 = __importDefault(require("../bean/ConsoleErrorHandler"));
const interface_1 = require("../interface");
const global_helper_1 = require("../helper/global-helper");
async function scanInFileSystem(rootPath) {
    const spinner = global_helper_1.genDotsSpinner("[1/4] Scanning");
    spinner.start();
    const HierachyTree = new Hierachy_1.default(null, rootPath, 0, interface_1.TypeNodeHierachy.Directory);
    await scanHierachyNode(spinner, HierachyTree);
    spinner.info(`Total storage: ${global_helper_1.bytesToSize(HierachyTree.storage)}`);
    spinner.succeed("[1/4] Scanning");
    return HierachyTree;
}
exports.scanInFileSystem = scanInFileSystem;
async function scanBigDirectoryInHierachy(rootHierachy, threshold) {
    const spinner = global_helper_1.genDotsSpinner("[2/4] Scanning big directory");
    spinner.start();
    const listBigNode = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
    spinner.info(`[2/4] ${listBigNode.length} directory contrain total file file size >= ${threshold}`);
    spinner.succeed("[2/4] Scanning big directory");
    return listBigNode;
}
exports.scanBigDirectoryInHierachy = scanBigDirectoryInHierachy;
async function removeParentInHierachy(rootHierachy) {
    const spinner = global_helper_1.genDotsSpinner("[3/4] Formatting data");
    spinner.start();
    removeParent(rootHierachy);
    spinner.succeed("[3/4] Formatting data");
    return rootHierachy;
}
exports.removeParentInHierachy = removeParentInHierachy;
async function writeResultToFile(scanDir, pathJSON, obj) {
    const spinner = global_helper_1.genDotsSpinner("[4/4] Writting result");
    spinner.start();
    try {
        if (!fs_1.default.existsSync(scanDir))
            fs_1.default.mkdirSync(scanDir);
        await new DiskFileSystem_1.default().writeFilePromise(pathJSON, JSON.stringify(obj));
        spinner.info(DiskColor_1.default.green("Finish!") + " Saved 1 new log file.");
        spinner.succeed("[4/4] Writting result");
    }
    catch (error) {
        new ConsoleErrorHandler_1.default(new DiskError_1.default(error));
        spinner.info("Failed! Write file log return with Error");
        spinner.fail("[4/4] Writting result");
    }
}
exports.writeResultToFile = writeResultToFile;
async function scanHierachyNode(spinner, rootNode) {
    spinner.text = rootNode.name;
    if (!isValidDirectory(rootNode.name))
        return;
    try {
        const childInDirectory = await new DiskFileSystem_1.default().lsCommandPromise(rootNode.name);
        const stats = await new DiskFileSystem_1.default().readStatDirPromise(rootNode.name, childInDirectory);
        const files = stats.filter(file => file.stats.isFile());
        const directories = stats.filter(dir => !dir.stats.isFile());
        const tasksForFile = files.map(item => actionEachNodeItem(spinner, rootNode, item.path, item.stats));
        const tasksForDirectory = directories.map(item => actionEachNodeItem(spinner, rootNode, item.path, item.stats));
        await Promise.all(tasksForFile);
        for (let i = 0; i < tasksForDirectory.length; i++) {
            await tasksForDirectory[i];
        }
    }
    catch (error) {
        new ConsoleErrorHandler_1.default(new DiskError_1.default(error));
        DiskFileSystem_1.default.handleError('scanHierachyNode', error);
    }
}
exports.scanHierachyNode = scanHierachyNode;
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
async function actionEachNodeItem(spinner, rootNode, pathToNode, stat) {
    if (stat) {
        const type = stat.isFile() ? interface_1.TypeNodeHierachy.File : interface_1.TypeNodeHierachy.Directory;
        const node = new Hierachy_1.default(rootNode, pathToNode, 0, type);
        rootNode.child.push(node);
        if (type == interface_1.TypeNodeHierachy.File) {
            node.addStorage(stat.size);
        }
        if (type == interface_1.TypeNodeHierachy.Directory) {
            await scanHierachyNode(spinner, node);
        }
    }
}
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
function isValidDirectory(pathToDirectory) {
    const regexCheck = /\/Volumes\//gi;
    if (pathToDirectory.match(regexCheck))
        return false;
    if (checkRepeatPath(pathToDirectory))
        return false;
    return true;
}
function checkRepeatPath(pathToDirectory) {
    const listItem = pathToDirectory.split("/").filter(Boolean);
    const mapItem = {};
    listItem.forEach(item => {
        if (mapItem[item])
            mapItem[item]++;
        else
            mapItem[item] = 1;
    });
    const values = Object.values(mapItem).filter(item => item >= 2);
    return values.length >= 2;
}
