"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface");
const DiskFileSystem_1 = __importDefault(require("../tools/DiskFileSystem"));
const Hierachy_1 = __importDefault(require("../bean/Hierachy"));
const ConsoleErrorHandler_1 = __importDefault(require("../bean/ConsoleErrorHandler"));
const DiskError_1 = __importDefault(require("../bean/DiskError"));
class HierachyScanner {
    constructor(node, spinner) {
        this.node = node;
        this.spinner = spinner;
    }
    async run() {
        var spinner = this.spinner;
        var rootNode = this.node;
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
}
exports.default = HierachyScanner;
async function actionEachNodeItem(spinner, rootNode, pathToNode, stat) {
    if (stat) {
        const type = stat.isFile() ? interface_1.TypeNodeHierachy.File : interface_1.TypeNodeHierachy.Directory;
        const node = new Hierachy_1.default(rootNode, pathToNode, 0, type);
        rootNode.child.push(node);
        if (type == interface_1.TypeNodeHierachy.File) {
            node.addStorage(stat.size, true);
        }
        if (type == interface_1.TypeNodeHierachy.Directory) {
            var scanner = new HierachyScanner(node, spinner);
            await scanner.run();
        }
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
    const listItem = pathToDirectory.split('/').filter(Boolean);
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
