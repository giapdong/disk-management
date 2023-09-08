import fs from 'fs';
import DiskFileSystem from '../tools/DiskFileSystem';
import Hierachy from '../bean/Hierachy';
import DiskError from '../bean/DiskError';
import DiskColor from '../helper/DiskColor';
import ConsoleErrorHandler from '../bean/ConsoleErrorHandler';
import { BigNode, TypeNodeHierachy } from '../interface';
import { bytesToSize, genDotsSpinner } from '../helper/global-helper';
import HierachyScanner from '../engine/scanner';

/**
 * @desc Scan in filesystem
 * @param rootPath Path pass by argument
 * @returns {Hierachy}
 */
export async function scanInFileSystem(rootPath: string): Promise<Hierachy> {
	const spinner = genDotsSpinner('[1/4] Scanning');
	spinner.start();

	const HierachyTree: Hierachy = new Hierachy(null, rootPath, 0, TypeNodeHierachy.Directory);
	var scanner = new HierachyScanner(HierachyTree, spinner);
	await scanner.run();

	spinner.info(`Total storage: ${bytesToSize(HierachyTree.storage)}`);
	spinner.succeed('[1/4] Scanning');

	return HierachyTree;
}

/**
 * Scan big directory in Hierachy node
 *
 * @param rootHierachy Root Hierachy
 * @param threshold Threshold wanna filter
 */
export async function scanBigDirectoryInHierachy(rootHierachy: Hierachy, threshold: number): Promise<BigNode[]> {
	const spinner = genDotsSpinner('[2/4] Scanning big directory');
	spinner.start();

	const listBigNode: BigNode[] = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
	spinner.info(`[2/4] ${listBigNode.length} directory contrain total file file size >= ${threshold}`);
	spinner.succeed('[2/4] Scanning big directory');

	return listBigNode;
}

/**
 * Remove parent reference in Hierachy instance
 *
 * @param rootHierachy Root Hierachy
 */
export async function removeParentInHierachy(rootHierachy: Hierachy): Promise<Hierachy> {
	const spinner = genDotsSpinner('[3/4] Formatting data');
	spinner.start();
	removeParent(rootHierachy);
	spinner.succeed('[3/4] Formatting data');
	return rootHierachy;
}

export async function writeResultToFile(scanDir: string, pathJSON: string, obj: any) {
	const spinner = genDotsSpinner('[4/4] Writting result');
	spinner.start();

	try {
		//Create scanDir
		if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

		// JSON.stringify(obj, null, 4)
		const compressed_data = await DiskFileSystem.compressFile(JSON.stringify(obj));
		await new DiskFileSystem().writeFilePromise(pathJSON + '.xjson', compressed_data);

		spinner.info(DiskColor.green('Finish!') + ' Saved 1 new log file.');
		spinner.succeed('[4/4] Writting result');
	} catch (error) {
		new ConsoleErrorHandler(new DiskError(error));
		spinner.info('Failed! Write file log return with Error');
		spinner.fail('[4/4] Writting result');
	}
}

/**
 * Get list big directory
 *
 * @param rootNode Hierachy node will scan
 * @param threshold Threshold storage
 */
export function getBigDirectoryFromRootHierachy(rootNode: Hierachy, threshold: number): BigNode[] {
	const result: BigNode[] = new Array<BigNode>();
	recursiveScanBigDirectory(result, rootNode, threshold);
	return result;
}

/**
 * Remove Hierachy ref by null value for store to json file
 *
 * @param root Root Hierachy
 */
export function removeParent(root: Hierachy): void {
	root.parent = null;
	root.child.forEach(child => {
		child.parent = null;
		if (child.type == TypeNodeHierachy.Directory) removeParent(child);
	});
}

/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */

/**
 * Recursive scan all big directory from root of hierachy
 *
 * @param arrayResult Array contrain BigNode item
 * @param rootNode Hierachy prepare scan
 * @param threshold Threshold that folder bigger will push to arrayResult
 */
function recursiveScanBigDirectory(arrayResult: BigNode[], rootNode: Hierachy, threshold: number): void {
	let tempStroge = 0;

	rootNode.child.forEach(child => {
		if (child.type === TypeNodeHierachy.File) tempStroge += child.storage;
		else recursiveScanBigDirectory(arrayResult, child, threshold);
	});

	if (tempStroge > threshold) {
		arrayResult.push({ path: rootNode.name, storage: tempStroge });
	}
}
