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
exports.readSystemPartition = exports.Compare = exports.Scan = void 0;
const path_1 = __importDefault(require("path"));
const interface_1 = require("./interface");
const global_helper_1 = require("./helper/global-helper");
const CompareHelper = __importStar(require("./helper/compare-helper"));
const ScanHelper = __importStar(require("./helper/scan-helper"));
const os_1 = __importDefault(require("os"));
const win32_1 = require("./os/win32");
const darwin_1 = require("./os/darwin");
const scanDir = path_1.default.join(__dirname, "..", "..", "scan");
const compareDir = path_1.default.join(__dirname, "..", "..", "compare");
async function Scan(root = __dirname, threshold = 1000000, mode = interface_1.ScanMode.Normal) {
    console.time("Disk-management-scanner");
    let HierachyTree = await ScanHelper.scanInFileSystem(root);
    let listBigNode = await ScanHelper.scanBigDirectoryInHierachy(HierachyTree, threshold);
    HierachyTree = await ScanHelper.removeParentInHierachy(HierachyTree);
    let pathJSON = path_1.default.join(scanDir, global_helper_1.getDateByFormat() + ".log");
    let obj = {
        time: new Date(Date.now()),
        total: HierachyTree.storage,
        big_directory: listBigNode,
        root: mode == interface_1.ScanMode.Normal ? HierachyTree : listBigNode
    };
    await ScanHelper.writeResultToFile(scanDir, pathJSON, obj);
    console.timeEnd("Disk-management-scanner");
}
exports.Scan = Scan;
async function Compare(threshold, pathToSourceFile, pathToTargetFile) {
    console.time("Disk-management-compare");
    let paramCompare;
    try {
        paramCompare = await CompareHelper.detectOptionsCompare(threshold, scanDir, pathToSourceFile, pathToTargetFile);
    }
    catch (error) {
        console.log(error);
        return;
    }
    let listChangeStatus = CompareHelper.resolveCompareData(paramCompare);
    await CompareHelper.storeResult(compareDir, listChangeStatus);
    console.timeEnd("Disk-management-compare");
}
exports.Compare = Compare;
function readSystemPartition() {
    return new Promise(async (resolve, reject) => {
        switch (os_1.default.platform()) {
            case "win32": {
                const data = await new win32_1.win32().readSystemPartition();
                return resolve(data);
            }
            case "darwin": {
                const data = await new darwin_1.darwin().readSystemPartition();
                return resolve(data);
            }
            default:
                resolve(null);
                break;
        }
    });
}
exports.readSystemPartition = readSystemPartition;
