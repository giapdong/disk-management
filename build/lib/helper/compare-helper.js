"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSmartHTML = exports.toHTML = exports.storeResult = exports.detectOptionsCompare = exports.resolveCompareData = exports.getListScanFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DiskColor_1 = __importDefault(require("../helper/DiskColor"));
const global_helper_1 = require("./global-helper");
const DiskFileSystem_1 = __importDefault(require("../tools/DiskFileSystem"));
const __1 = require("..");
async function getListScanFile(pathToScanDir) {
    const spinner = global_helper_1.genDotsSpinner('[1/3] Reading result');
    spinner.start();
    let listScanFile;
    try {
        listScanFile = await new DiskFileSystem_1.default().lsCommandPromise(pathToScanDir);
    }
    catch (error) {
        spinner.fail(error.message);
        throw error;
    }
    if (listScanFile.length < 2) {
        const titleError = DiskColor_1.default.red('[1/3] Failed') + `, too little log file in ${pathToScanDir}`;
        spinner.fail(titleError);
        throw new Error(titleError);
    }
    spinner.succeed('[1/3] Reading result');
    return listScanFile;
}
exports.getListScanFile = getListScanFile;
async function resolveCompareData(compareOptions) {
    const spinner = global_helper_1.genDotsSpinner('[2/3] Resolving result');
    spinner.start();
    const dataSource = await DiskFileSystem_1.default.extractFile(compareOptions.pathToSourceFile);
    const dataTarget = await DiskFileSystem_1.default.extractFile(compareOptions.pathToTargetFile);
    const json1 = JSON.parse(dataSource.toString()).bigDirectory;
    const json2 = JSON.parse(dataTarget.toString()).bigDirectory;
    let listBigNode = json1.map(item => item.path).concat(json2.map(item => item.path));
    listBigNode = [...new Set(listBigNode)];
    const listChangeStatus = [];
    listBigNode.forEach(node => {
        const nodeInJSON1 = json1.find(item => item.path == node);
        const nodeInJSON2 = json2.find(item => item.path == node);
        if (nodeInJSON1 && nodeInJSON2) {
            let change = (nodeInJSON1 === null || nodeInJSON1 === void 0 ? void 0 : nodeInJSON1.storage) - (nodeInJSON2 === null || nodeInJSON2 === void 0 ? void 0 : nodeInJSON2.storage);
            if (Math.abs(change) > compareOptions.threshold) {
                listChangeStatus.push({
                    name: node,
                    change: {
                        size: change,
                        hsize: global_helper_1.bytesToSize(change)
                    }
                });
            }
        }
        else if (nodeInJSON1 || nodeInJSON2) {
            let change = 0;
            if (nodeInJSON1)
                change = nodeInJSON1.storage;
            if (nodeInJSON2)
                change = -nodeInJSON2.storage;
            if (Math.abs(change) > compareOptions.threshold) {
                listChangeStatus.push({
                    name: node,
                    change: {
                        size: change,
                        hsize: global_helper_1.bytesToSize(change)
                    }
                });
            }
        }
    });
    spinner.succeed('[2/3] Resolving result');
    return listChangeStatus;
}
exports.resolveCompareData = resolveCompareData;
async function detectOptionsCompare(threshold, pathToScanDir, pathToSourceFile, pathToTargetFile) {
    let optionsCompare = { threshold, pathToSourceFile: '', pathToTargetFile: '' };
    let listScanFile;
    try {
        listScanFile = await getListScanFile(pathToScanDir);
    }
    catch (error) {
        throw error;
    }
    if (pathToSourceFile)
        optionsCompare.pathToSourceFile = pathToSourceFile;
    else {
        let olderScanFile = listScanFile[listScanFile.length - 2];
        optionsCompare.pathToSourceFile = path_1.default.join(pathToScanDir, olderScanFile);
    }
    if (pathToTargetFile)
        optionsCompare.pathToTargetFile = pathToTargetFile;
    else {
        let newestScanFile = listScanFile[listScanFile.length - 1];
        optionsCompare.pathToTargetFile = path_1.default.join(pathToScanDir, newestScanFile);
    }
    return optionsCompare;
}
exports.detectOptionsCompare = detectOptionsCompare;
async function storeResult(compareDir, data) {
    const spinner = global_helper_1.genDotsSpinner('[3/3] Writting result');
    spinner.start();
    if (!fs_1.default.existsSync(compareDir))
        fs_1.default.mkdirSync(compareDir);
    const pathJSON = path_1.default.join(compareDir, global_helper_1.getDateByFormat() + '.json');
    const json = JSON.stringify(data, null, 4);
    try {
        await new DiskFileSystem_1.default().writeFilePromise(pathJSON, json);
    }
    catch (error) {
        throw error;
    }
    spinner.info(DiskColor_1.default.green('Done!') + ' Saved 1 new log file.');
    spinner.succeed('[3/3] Writting result');
}
exports.storeResult = storeResult;
async function toHTML(changes, filename = 'disk.html') {
    var filepath = path_1.default.join(__dirname, '../../static/disk.template.html');
    var template = fs_1.default.readFileSync(filepath, 'utf-8');
    var html = '';
    for (var i = 0; i < changes.length; i++) {
        var node = changes[i];
        var num = node.change.size;
        html += `
			<tr>
				<td>${node.name}</td>
				<td>${num.toLocaleString('en-US')}</td>
				<td>${node.change.hsize}</td>
			</tr>
		`;
    }
    html = `
		<table>
			<thead>
				<th class='folder'>Folder</th>
				<th class='size'>Size (Bytes)</th>
				<th class='hsize'>Human Size</th>
			</thead>

			<tbody>
				${html}
			</tbody>
		</table>
	`;
    template = template.replace('{{content}}', html);
    var filename = path_1.default.join(__1.compareDir, filename);
    fs_1.default.writeFileSync(filename, template);
}
exports.toHTML = toHTML;
async function toSmartHTML() {
    var patterns = [
        { pattern: /C:\\\$Recycle\.Bin/, alias: 'Recycle Bin' },
        { pattern: /C:\\Users\\admin\\AppData\\Local\\Yarn\\Cache\\[\w]+/, alias: 'Yarn Cache' },
        { pattern: /([\\\/\w-\.\$\:]+)package\.json/, alias: '$1' },
        { pattern: /([\\\/\w-\.\$\:]+)\.git/, alias: '$1' }
    ];
}
exports.toSmartHTML = toSmartHTML;
