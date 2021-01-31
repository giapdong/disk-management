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
  // emitter.emit(EventType.ScanDone);
}

async function scanHierachyNode(rootNode: Hierachy) {
  let dirInfo;
  spinner.text = rootNode.name;
  try {
    dirInfo = await FS_TOOLS.lsCommandPromise(rootNode.name);
  } catch (error) {
    dirInfo = error;
    console.log(error);
  }

  if (dirInfo && dirInfo.name != Error.name) {
    let promise: any[] = [];
    let data: StatsNode[] = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);

    data?.map(item => {
      promise.push(actionEachItem(rootNode, item.path, item.stats));
    });

    await Promise.all(promise);
  }
}

async function actionEachItem(rootNode: Hierachy, pathToNode: string, stat: Stats): Promise<void> {
  if (stat && stat.constructor.name != Error.name) {
    let type = stat.isFile() ? TypeNodeHierachy.File : TypeNodeHierachy.Directory;
    let node = new Hierachy(rootNode, pathToNode, 0, type);

    rootNode.child.push(node);

    if (type == TypeNodeHierachy.File) {
      node.addStorage(stat.size);
    }

    if (type == TypeNodeHierachy.Directory) {
      await scanHierachyNode(node);
    }
  }
}
