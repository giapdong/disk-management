import { Stats } from "fs";
import * as FS_TOOLS from "@lib/tools/filesystem";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { StatsNode, TypeNodeHierachy } from "@root/types";
import { Ora } from "ora";

export async function scanHierachyNode(spinner: Ora, rootNode: Hierachy) {
  spinner.text = rootNode.name;
  try {
    let dirInfo: string[] = await FS_TOOLS.lsCommandPromise(rootNode.name);
    let data: StatsNode[] = await FS_TOOLS.readStatDirPromise(rootNode.name, dirInfo);

    let promise: any[] = data?.map(item => {
      return actionEachNodeItem(spinner, rootNode, item.path, item.stats);
    });

    await Promise.all(promise);
  } catch (error) {
    console.log(error);
  }
}

export async function actionEachNodeItem(
  spinner: Ora,
  rootNode: Hierachy,
  pathToNode: string,
  stat: Stats
): Promise<void> {
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
