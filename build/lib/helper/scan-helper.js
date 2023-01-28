"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeParent = exports.getBigDirectoryFromRootHierachy = exports.scanHierachyNode = exports.writeResultToFile = exports.removeParentInHierachy = exports.scanBigDirectoryInHierachy = exports.scanInFileSystem = void 0;
const fs_1 = __importDefault(require("fs"));
const FS_TOOLS = __importStar(require("../tools/filesystem"));
const node_hierachy_1 = require("../bean/node-hierachy");
const interface_1 = require("../interface");
const global_helper_1 = require("../helper/global-helper");
const colors_1 = __importDefault(require("colors"));
async function scanInFileSystem(rootPath) {
    const spinner = global_helper_1.genDotsSpinner("[1/4] Scanning");
    spinner.start();
    let HierachyTree = new node_hierachy_1.Hierachy(null, rootPath, 0, interface_1.TypeNodeHierachy.Directory);
    await scanHierachyNode(spinner, HierachyTree);
    spinner.info(`Total storage: ${global_helper_1.bytesToSize(HierachyTree.storage)}`);
    spinner.succeed("[1/4] Scanning");
    return HierachyTree;
}
exports.scanInFileSystem = scanInFileSystem;
async function scanBigDirectoryInHierachy(rootHierachy, threshold) {
    const spinner = global_helper_1.genDotsSpinner("[2/4] Scanning big directory");
    spinner.start();
    let listBigNode = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
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
        await FS_TOOLS.writeFilePromise(pathJSON, JSON.stringify(obj));
        spinner.info(colors_1.default.green("Finish!") + " Saved 1 new log file.");
        spinner.succeed("[4/4] Writting result");
    }
    catch (error) {
        console.log(error);
        spinner.info("Failed! Write file log return with Error");
        spinner.fail("[4/4] Writting result");
    }
}
exports.writeResultToFile = writeResultToFile;
async function scanHierachyNode(spinner, rootNode) {
    spinner.text = rootNode.name;
    try {
        let dirInfo = await FS_TOOLS.lsCommandPromise(rootNode.name);
        let data = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);
        let promise = data === null || data === void 0 ? void 0 : data.map(item => {
            return actionEachNodeItem(spinner, rootNode, item.path, item.stats);
        });
        await Promise.all(promise);
    }
    catch (error) {
        FS_TOOLS.log('scanHierachyNode', error);
    }
}
exports.scanHierachyNode = scanHierachyNode;
function getBigDirectoryFromRootHierachy(rootNode, threshold) {
    let result = new Array();
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
        let type = stat.isFile() ? interface_1.TypeNodeHierachy.File : interface_1.TypeNodeHierachy.Directory;
        let node = new node_hierachy_1.Hierachy(rootNode, pathToNode, 0, type);
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
