import fs from 'fs';
import path from 'path';
import DiskColor from '../helper/DiskColor';
import { BigNode, ChangeNode, IOptionsCompare } from '../interface';
import { getDateByFormat, genDotsSpinner, bytesToSize } from './global-helper';
import DiskFileSystem from '../tools/DiskFileSystem';
import { compareDir } from '..';

export async function getListScanFile(pathToScanDir: string): Promise<string[]> {
	const spinner = genDotsSpinner('[1/3] Reading result');
	spinner.start();

	let listScanFile: string[];
	try {
		listScanFile = await new DiskFileSystem().lsCommandPromise(pathToScanDir);
	} catch (error) {
		spinner.fail(error.message);
		throw error;
	}

	if (listScanFile.length < 2) {
		const titleError = DiskColor.red('[1/3] Failed') + `, too little log file in ${pathToScanDir}`;
		spinner.fail(titleError);
		throw new Error(titleError);
	}
	spinner.succeed('[1/3] Reading result');
	return listScanFile;
}

export function resolveCompareData(compareOptions: IOptionsCompare): ChangeNode[] {
	const spinner = genDotsSpinner('[2/3] Resolving result');
	spinner.start();

	const dataSource = fs.readFileSync(compareOptions.pathToSourceFile, 'utf-8');
	const dataTarget = fs.readFileSync(compareOptions.pathToTargetFile, 'utf-8');

	const json1 = JSON.parse(dataSource).bigDirectory as BigNode[];
	const json2 = JSON.parse(dataTarget).bigDirectory as BigNode[];

	let listBigNode: string[] = json1.map(item => item.path).concat(json2.map(item => item.path));
	listBigNode = [...new Set(listBigNode)];

	const listChangeStatus: ChangeNode[] = [];

	listBigNode.forEach(node => {
		const nodeInJSON1 = json1.find(item => item.path == node);
		const nodeInJSON2 = json2.find(item => item.path == node);

		if (nodeInJSON1 && nodeInJSON2) {
			let change: number = nodeInJSON1?.storage - nodeInJSON2?.storage;
			if (Math.abs(change) > compareOptions.threshold) {
				listChangeStatus.push({
					name: node,
					change: {
						size: change,
						hsize: bytesToSize(change)
					}
				});
			}
		} else if (nodeInJSON1 || nodeInJSON2) {
			let change: number = 0;
			if (nodeInJSON1) change = nodeInJSON1.storage;
			if (nodeInJSON2) change = -nodeInJSON2.storage;

			if (Math.abs(change) > compareOptions.threshold) {
				listChangeStatus.push({
					name: node,
					change: {
						size: change,
						hsize: bytesToSize(change)
					}
				});
			}
		}
	});

	spinner.succeed('[2/3] Resolving result');
	return listChangeStatus;
}

/**
 * @desc Ensure compare option
 * @param threshold Threshold of difference
 * @param pathToScanDir Path to scan dir result
 * @param pathToSourceFile Source file
 * @param pathToTargetFile Target file
 * @returns {IOptionsCompare}
 */
export async function detectOptionsCompare(
	threshold: number,
	pathToScanDir: string,
	pathToSourceFile: string | undefined,
	pathToTargetFile: string | undefined
): Promise<IOptionsCompare> {
	let optionsCompare: IOptionsCompare = { threshold, pathToSourceFile: '', pathToTargetFile: '' };
	let listScanFile: string[];

	try {
		listScanFile = await getListScanFile(pathToScanDir);
	} catch (error) {
		throw error;
	}

	if (pathToSourceFile) optionsCompare.pathToSourceFile = pathToSourceFile;
	else {
		let olderScanFile: string = listScanFile[listScanFile.length - 2];
		optionsCompare.pathToSourceFile = path.join(pathToScanDir, olderScanFile);
	}

	if (pathToTargetFile) optionsCompare.pathToTargetFile = pathToTargetFile;
	else {
		let newestScanFile: string = listScanFile[listScanFile.length - 1];
		optionsCompare.pathToTargetFile = path.join(pathToScanDir, newestScanFile);
	}

	return optionsCompare;
}

export async function storeResult(compareDir: string, data: any) {
	const spinner = genDotsSpinner('[3/3] Writting result');
	spinner.start();

	if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);

	const pathJSON = path.join(compareDir, getDateByFormat() + '.json');
	const json = JSON.stringify(data, null, 4);
	try {
		await new DiskFileSystem().writeFilePromise(pathJSON, json);
	} catch (error) {
		throw error;
	}

	spinner.info(DiskColor.green('Done!') + ' Saved 1 new log file.');
	spinner.succeed('[3/3] Writting result');
}

/**
 * @desc to HTML
 * @see {@link https://www.tutorialstonight.com/javascript-number-format}
 * Sort table @see {@link https://stackoverflow.com/questions/3160277/jquery-table-sort}
 * @param changes
 * @param filename
 */
export async function toHTML(changes: ChangeNode[], filename: string = 'disk.html') {
	var filepath = path.join(__dirname, '../../static/disk.template.html');
	var template = fs.readFileSync(filepath, 'utf-8');

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

	var filename = path.join(compareDir, filename);
	fs.writeFileSync(filename, template);
}
