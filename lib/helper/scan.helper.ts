import { Stats } from "fs";
import * as FS_TOOLS from "@lib/tools/filesystem";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { BigNode, StatsNode, TypeNodeHierachy } from "@root/types";
import { Ora } from "ora";

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
