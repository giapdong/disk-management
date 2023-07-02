import { Ora } from "ora";
import fs, { Stats } from "fs";
import DiskFileSystem from "../tools/DiskFileSystem";
import Hierachy from "../bean/Hierachy";
import DiskError from "../bean/DiskError";
import DiskColor from "../helper/DiskColor";
import ConsoleErrorHandler from "../bean/ConsoleErrorHandler";
import { BigNode, StatsNode, TypeNodeHierachy, NodeInPathName } from "../interface";
import { bytesToSize, genDotsSpinner } from "../helper/global-helper";

/**
 * @desc Scan in filesystem
 * @param rootPath Path pass by argument
 * @returns {Hierachy}
 */
export async function scanInFileSystem(rootPath: string): Promise<Hierachy> {
  const spinner = genDotsSpinner("[1/4] Scanning");
  spinner.start();

  const HierachyTree: Hierachy = new Hierachy(null, rootPath, 0, TypeNodeHierachy.Directory);
  await scanHierachyNode(spinner, HierachyTree);
  spinner.info(`Total storage: ${bytesToSize(HierachyTree.storage)}`);
  spinner.succeed("[1/4] Scanning");

  return HierachyTree;
}

/**
 * Scan big directory in Hierachy node
 *
 * @param rootHierachy Root Hierachy
 * @param threshold Threshold wanna filter
 */
export async function scanBigDirectoryInHierachy(rootHierachy: Hierachy, threshold: number): Promise<BigNode[]> {
  const spinner = genDotsSpinner("[2/4] Scanning big directory");
  spinner.start();

  const listBigNode: BigNode[] = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
  spinner.info(`[2/4] ${listBigNode.length} directory contrain total file file size >= ${threshold}`);
  spinner.succeed("[2/4] Scanning big directory");

  return listBigNode;
}

/**
 * Remove parent reference in Hierachy instance
 *
 * @param rootHierachy Root Hierachy
 */
export async function removeParentInHierachy(rootHierachy: Hierachy): Promise<Hierachy> {
  const spinner = genDotsSpinner("[3/4] Formatting data");
  spinner.start();
  removeParent(rootHierachy);
  spinner.succeed("[3/4] Formatting data");
  return rootHierachy;
}

export async function writeResultToFile(scanDir: string, pathJSON: string, obj: any) {
  const spinner = genDotsSpinner("[4/4] Writting result");
  spinner.start();

  try {
    //Create scanDir
    if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

    // JSON.stringify(obj, null, 4)
    await new DiskFileSystem().writeFilePromise(pathJSON, JSON.stringify(obj));

    spinner.info(DiskColor.green("Finish!") + " Saved 1 new log file.");
    spinner.succeed("[4/4] Writting result");
  } catch (error) {
    new ConsoleErrorHandler(new DiskError(error));
    spinner.info("Failed! Write file log return with Error");
    spinner.fail("[4/4] Writting result");
  }
}

/**
 * Scan and fill to Hierachy node
 *
 * @param spinner Ora spinner
 * @param rootNode Hierachy node
 */
export async function scanHierachyNode(spinner: Ora, rootNode: Hierachy): Promise<void> {
  spinner.text = rootNode.name;
  if (!isValidDirectory(rootNode.name)) return;
  try {
    const childInDirectory: string[] = await new DiskFileSystem().lsCommandPromise(rootNode.name);
    const stats: StatsNode[] = await new DiskFileSystem().readStatDirPromise(rootNode.name, childInDirectory);

    const files: StatsNode[] = stats.filter(file => file.stats.isFile());
    const directories: StatsNode[] = stats.filter(dir => !dir.stats.isFile());

    const tasksForFile: Promise<void>[] = files.map(item => actionEachNodeItem(spinner, rootNode, item.path, item.stats));
    const tasksForDirectory: Promise<void>[] = directories.map(item => actionEachNodeItem(spinner, rootNode, item.path, item.stats));

    await Promise.all(tasksForFile);
    for (let i = 0; i < tasksForDirectory.length; i++) {
      await tasksForDirectory[i];
    }
  } catch (error) {
    new ConsoleErrorHandler(new DiskError(error));
    DiskFileSystem.handleError("scanHierachyNode", error);
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
      node.addStorage(stat.size);
    }

    if (type == TypeNodeHierachy.Directory) {
      await scanHierachyNode(spinner, node);
    }
  }
}

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

function isValidDirectory(pathToDirectory: string): boolean {
  const regexCheck = /\/Volumes\//gi;
  if (pathToDirectory.match(regexCheck)) return false;
  if (checkRepeatPath(pathToDirectory)) return false;
  return true;
}

function checkRepeatPath(pathToDirectory: string): boolean {
  const listItem: string[] = pathToDirectory.split("/").filter(Boolean);
  const mapItem: NodeInPathName = {};
  listItem.forEach(item => {
    if (mapItem[item]) mapItem[item]++;
    else mapItem[item] = 1;
  });
  const values = Object.values(mapItem).filter(item => item >= 2);
  return values.length >= 2;
}
