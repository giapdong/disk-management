import fs, { Stats } from "fs";
import path from "path";
import colors from "colors";
import ora from "ora";
import { ScanMode, StatsNode, TypeNodeHierachy } from "@root/types";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { bytesToSize } from "@lib/helper/global.helper";
import * as ScanHelper from "@lib/helper/scan.helper";
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
  await ScanHelper.scanHierachyNode(spinner, HierachyTree);
  spinner.succeed("[1/4] Scanning");

  console.log(`Total storage: ${bytesToSize(HierachyTree.storage)}`);

  console.log(HierachyTree.name, HierachyTree.storage);
  console.timeEnd("Disk-management-scanner");
  // emitter.emit(EventType.ScanDone);
}
