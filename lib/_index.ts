import fs, { Stats } from "fs";
import path from "path";
import colors from "colors";
import ora from "ora";
import * as TYPE from "@root/types";
import { Hierachy } from "@lib/bean/NodeHierachy";
import * as FS_TOOLS from "@lib/tools/filesystem";

let HierachyTree = null;
const userParam = {
  bigDirectory: 1000000,
  mode: TYPE.ScanMode.Normal
};
const spinner = ora({
  text: "[1/4] Scanning",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  }
});

export async function Scan(root = __dirname, threshold = 1000000, mode = TYPE.ScanMode.Normal) {
  userParam.bigDirectory = threshold;
  userParam.mode = mode;
  console.time("Disk-management-scanner");
  HierachyTree = new Hierachy(null, root, 0, TYPE.TypeNodeHierachy.Directory);
  spinner.start();
  await readFromRoot(HierachyTree);
  spinner.succeed("[1/4] Scanning");
  // emitter.emit(EventType.ScanDone);
}

async function readFromRoot(rootNode: Hierachy) {
  //Scan all item into directory with path: rootPath
  let dirInfo;
  spinner.text = rootNode.name;
  try {
    dirInfo = await FS_TOOLS.lsCommandPromise(rootNode.name);
  } catch (error) {
    dirInfo = error;
  }

  if (dirInfo && dirInfo.name != Error.name) {
    let promise: any[] = [];
    let data = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);

    data?.map(item => {
      promise.push(actionEachItem(rootNode, item.name, item.data));
    });

    await Promise.all(promise);
  }
}

async function actionEachItem(rootNode: Hierachy, element: string, stat: Stats) {
  let pathToNode = path.join(rootNode.name, element);
  if (stat && stat.constructor.name != Error.name) {
    let type = stat.isFile() ? TYPE.TypeNodeHierachy.File : TYPE.TypeNodeHierachy.Directory;
    let node = new Hierachy(rootNode, pathToNode, 0, type);

    rootNode.child.push(node);

    if (type == TYPE.TypeNodeHierachy.File) {
      node.addStorage(stat.size);
    }

    if (type == TYPE.TypeNodeHierachy.Directory) {
      await readFromRoot(node);
    }
  }
  return 0;
}
