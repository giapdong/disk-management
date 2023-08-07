import { Ora } from 'ora';
import { NodeInPathName, StatsNode, TypeNodeHierachy } from '../interface';
import DiskFileSystem from '../tools/DiskFileSystem';
import { Stats } from 'fs';
import Hierachy from '../bean/Hierachy';
import ConsoleErrorHandler from '../bean/ConsoleErrorHandler';
import DiskError from '../bean/DiskError';

export default class HierachyScanner {
	node: Hierachy;
	spinner: Ora;

	constructor(node: Hierachy, spinner: Ora) {
		this.node = node;
		this.spinner = spinner;
	}

	/**
	 * @desc Scan and fill to Hierachy node
	 */
	async run(): Promise<void> {
		var spinner = this.spinner;
		var rootNode = this.node;

		spinner.text = rootNode.name;
		if (!isValidDirectory(rootNode.name)) return;

		try {
			const childInDirectory: string[] = await new DiskFileSystem().lsCommandPromise(rootNode.name);
			const stats: StatsNode[] = await new DiskFileSystem().readStatDirPromise(rootNode.name, childInDirectory);

			const files: StatsNode[] = stats.filter(file => file.stats.isFile());
			const directories: StatsNode[] = stats.filter(dir => !dir.stats.isFile());

			const tasksForFile: Promise<void>[] = files.map(item =>
				actionEachNodeItem(spinner, rootNode, item.path, item.stats)
			);

			const tasksForDirectory: Promise<void>[] = directories.map(item =>
				actionEachNodeItem(spinner, rootNode, item.path, item.stats)
			);

			await Promise.all(tasksForFile);
			for (let i = 0; i < tasksForDirectory.length; i++) {
				await tasksForDirectory[i];
			}
		} catch (error) {
			new ConsoleErrorHandler(new DiskError(error));
			DiskFileSystem.handleError('scanHierachyNode', error);
		}
	}
}

/**
 * Describe action for each Node
 *
 * @param spinner Ora spinner
 * @param rootNode Hierachy node will scan
 * @param pathToNode Path to node will take an action
 * @param stat Status of node
 */
async function actionEachNodeItem(spinner: Ora, rootNode: Hierachy, pathToNode: string, stat: Stats): Promise<void> {
	if (stat) {
		const type: TypeNodeHierachy = stat.isFile() ? TypeNodeHierachy.File : TypeNodeHierachy.Directory;
		const node: Hierachy = new Hierachy(rootNode, pathToNode, 0, type);

		rootNode.child.push(node);

		if (type == TypeNodeHierachy.File) {
			node.addStorage(stat.size, true);
		}

		if (type == TypeNodeHierachy.Directory) {
			var scanner = new HierachyScanner(node, spinner);
			await scanner.run();
		}
	}
}

function isValidDirectory(pathToDirectory: string): boolean {
	const regexCheck = /\/Volumes\//gi;
	if (pathToDirectory.match(regexCheck)) return false;
	if (checkRepeatPath(pathToDirectory)) return false;
	return true;
}

function checkRepeatPath(pathToDirectory: string): boolean {
	const listItem: string[] = pathToDirectory.split('/').filter(Boolean);
	const mapItem: NodeInPathName = {};

	listItem.forEach(item => {
		if (mapItem[item]) mapItem[item]++;
		else mapItem[item] = 1;
	});

	const values = Object.values(mapItem).filter(item => item >= 2);
	return values.length >= 2;
}
