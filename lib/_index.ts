import fs, { Stats } from "fs";
import path from "path";
import colors from "colors";
import ora from "ora";
import { ScanMode, StatsNode, TypeNodeHierachy } from "@root/types";
import { Hierachy } from "@lib/bean/NodeHierachy";
import * as FS_TOOLS from "@lib/tools/filesystem";

let HierachyTree = null;
const userParam = {
  bigDirectory: 1000000,
  mode: ScanMode.Normal
};
const spinner = ora({
  text: "[1/4] Scanning",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  }
});

export async function Scan(root = __dirname, threshold = 1000000, mode = ScanMode.Normal) {
  userParam.bigDirectory = threshold;
  userParam.mode = mode;

  console.time("Disk-management-scanner");
  HierachyTree = new Hierachy(null, root, 0, TypeNodeHierachy.Directory);
  spinner.start();
  await scanHierachyNode(HierachyTree);
  spinner.succeed("[1/4] Scanning");

  console.log(HierachyTree.name, HierachyTree.storage);
  console.timeEnd("Disk-management-scanner");
  // emitter.emit(EventType.ScanDone);
}

/* ****************************************************************************************************** */
/* ****************************************************************************************************** */
/* ****************************************************************************************************** */

async function scanHierachyNode(rootNode: Hierachy) {
  spinner.text = rootNode.name;
  try {
    let dirInfo: string[] = await FS_TOOLS.lsCommandPromise(rootNode.name);
    let data: StatsNode[] = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);

    let promise: any[] = data?.map(item => {
      return actionEachNodeItem(rootNode, item.path, item.stats);
    });

    await Promise.all(promise);
  } catch (error) {
    console.log(error);
  }
}

async function actionEachNodeItem(rootNode: Hierachy, pathToNode: string, stat: Stats): Promise<void> {
  if (stat) {
    let type: TypeNodeHierachy = stat.isFile() ? TypeNodeHierachy.File : TypeNodeHierachy.Directory;
    let node: Hierachy = new Hierachy(rootNode, pathToNode, 0, type);

    rootNode.child.push(node);

    if (type == TypeNodeHierachy.File) {
      node.addStorage(stat.size);
    }

    if (type == TypeNodeHierachy.Directory) {
      await scanHierachyNode(node);
    }
  }
}
