import fs, { Stats } from "fs";
import * as FS_TOOLS from "@lib/tools/filesystem";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { BigNode, StatsNode, TypeNodeHierachy } from "@root/types";
import ora, { Ora } from "ora";
import { bytesToSize } from "@lib/helper/global.helper";

/**
 * Scan in filesystem
 *
 * @param rootPath Path pass by argument
 */
export async function scanInFileSystem(rootPath: string): Promise<Hierachy> {
  const spinner = ora({
    text: "[1/4] Scanning",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });

  let HierachyTree: Hierachy = new Hierachy(null, rootPath, 0, TypeNodeHierachy.Directory);
  spinner.start();
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
  const spinner = ora({
    text: "[2/4] Scanning big directory",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();
  let listBigNode: BigNode[] = getBigDirectoryFromRootHierachy(rootHierachy, threshold);
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
  const spinner = ora({
    text: "[3/4] Formatting data",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });

  spinner.start();
  removeParent(rootHierachy);
  spinner.succeed("[3/4] Formatting data");
  return rootHierachy;
}

export async function writeResultToFile(scanDir: string, pathJSON: string, obj: any) {
  const spinner = ora({
    text: "[4/4] Writting result",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();

  try {
    //Create scanDir
    if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

    // JSON.stringify(obj, null, 4)
    await FS_TOOLS.writeFilePromise(pathJSON, JSON.stringify(obj));

    spinner.info("Finish" + " Saved 1 new log file.");
    spinner.succeed("[4/4] Writting result");
  } catch (error) {
    console.log(error);
    spinner.info("Failed" + " Write file log return with Errror");
    spinner.fail("[4/4] Writting result");
  }
}

/**
 * Scan and fill to Hierachy node
 *
 * @param spinner Ora spinner
 * @param rootNode Hierachy node
 */
export async function scanHierachyNode(spinner: Ora, rootNode: Hierachy) {
  spinner.text = rootNode.name;
  try {
    let dirInfo: string[] = await FS_TOOLS.lsCommandPromise(rootNode.name);
    let data: StatsNode[] = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);

    let promise: Promise<void>[] = data?.map(item => {
      return actionEachNodeItem(spinner, rootNode, item.path, item.stats);
    });

    await Promise.all(promise);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get list big directory
 *
 * @param rootNode Hierachy node will scan
 * @param threshold Threshold storage
 */
export function getBigDirectoryFromRootHierachy(rootNode: Hierachy, threshold: number): BigNode[] {
  let result: BigNode[] = new Array<BigNode>();
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
    let type: TypeNodeHierachy = stat.isFile() ? TypeNodeHierachy.File : TypeNodeHierachy.Directory;
    let node: Hierachy = new Hierachy(rootNode, pathToNode, 0, type);

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
