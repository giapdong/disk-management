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
exports.ensureEnviroment = exports.readSystemPartition = exports.analyze = exports.Compare = exports.Scan = exports.compareDir = exports.scanDir = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const interface_1 = require("./interface");
const DiskError_1 = __importDefault(require("./bean/DiskError"));
const ConsoleErrorHandler_1 = __importDefault(require("./bean/ConsoleErrorHandler"));
const global_helper_1 = require("./helper/global-helper");
const CompareHelper = __importStar(require("./helper/compare-helper"));
const ScanHelper = __importStar(require("./helper/scan-helper"));
const win32_1 = require("./os/win32");
const unix_1 = require("./os/unix");
const linux_1 = require("./os/linux");
const analyzer_1 = __importDefault(require("./modues/analyzer"));
exports.scanDir = path_1.default.join(__dirname, '..', '..', 'scan');
exports.compareDir = path_1.default.join(__dirname, '..', '..', 'compare');
async function Scan(root = __dirname, threshold = 1048576, mode = interface_1.ScanMode.SaveToDisk) {
    console.time('Disk-management-scanner');
    await ensureEnviroment();
    let HierachyTree = await ScanHelper.scanInFileSystem(root);
    const listBigNode = await ScanHelper.scanBigDirectoryInHierachy(HierachyTree, threshold);
    HierachyTree = await ScanHelper.removeParentInHierachy(HierachyTree);
    const pathJSON = path_1.default.join(exports.scanDir, global_helper_1.getDateByFormat() + '.json');
    const diskResult = {
        time: new Date(Date.now()),
        total: HierachyTree.storage,
        threshold,
        bigDirectory: listBigNode,
        root: HierachyTree
    };
    if (mode == interface_1.ScanMode.ReturnResult) {
        console.timeEnd('Disk-management-scanner');
        return diskResult;
    }
    await ScanHelper.writeResultToFile(exports.scanDir, pathJSON, diskResult);
    console.timeEnd('Disk-management-scanner');
    return null;
}
exports.Scan = Scan;
async function Compare(threshold, pathToSourceFile, pathToTargetFile, engine = interface_1.CompareEngine.JSON) {
    console.time('Disk-management-compare');
    await ensureEnviroment();
    let paramCompare;
    try {
        paramCompare = await CompareHelper.detectOptionsCompare(threshold, exports.scanDir, pathToSourceFile, pathToTargetFile);
    }
    catch (error) {
        new ConsoleErrorHandler_1.default(new DiskError_1.default(error));
        return;
    }
    const listChangeStatus = CompareHelper.resolveCompareData(paramCompare);
    if (engine == interface_1.CompareEngine.JSON) {
        await CompareHelper.storeResult(exports.compareDir, listChangeStatus);
    }
    else {
        await CompareHelper.toHTML(listChangeStatus);
    }
    console.timeEnd('Disk-management-compare');
}
exports.Compare = Compare;
async function analyze(filepath) {
    await analyzer_1.default.run(filepath);
}
exports.analyze = analyze;
;
function readSystemPartition() {
    return new Promise(async (resolve, reject) => {
        let diskInstance;
        switch (os_1.default.platform()) {
            case 'win32':
                diskInstance = new win32_1.win32();
            case 'linux':
                diskInstance = new linux_1.linux();
            default:
                diskInstance = new unix_1.unix();
        }
        const data = diskInstance.readSystemPartition();
        resolve(data);
    });
}
exports.readSystemPartition = readSystemPartition;
function ensureEnviroment() {
    fs_1.default.mkdirSync(exports.scanDir, { recursive: true });
    fs_1.default.mkdirSync(exports.compareDir, { recursive: true });
}
exports.ensureEnviroment = ensureEnviroment;
