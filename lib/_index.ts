import fs, { Stats } from "fs";
import path from "path";
import colors from "colors";
import ora from "ora";
import { BigNode, ScanMode, StatsNode, TypeNodeHierachy, color } from "@lib/interface";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { bytesToSize, getDateByFormat } from "@lib/helper/global.helper";
import * as CompareHelper from "@lib/helper/compare.helper";
import * as ScanHelper from "@lib/helper/scan.helper";
import * as FS_TOOLS from "@lib/tools/filesystem";

colors.setTheme(color);

const scanDir = path.join(__dirname, "..", "scan");
const compareDir = path.join(__dirname, "..", "compare");

export async function Scan(root = __dirname, threshold = 1000000, mode = ScanMode.Normal) {
  console.time("Disk-management-scanner");

  let HierachyTree: Hierachy = await ScanHelper.scanInFileSystem(root);
  let listBigNode: BigNode[] = await ScanHelper.scanBigDirectoryInHierachy(HierachyTree, threshold);
  HierachyTree = await ScanHelper.removeParentInHierachy(HierachyTree);

  let pathJSON = path.join(scanDir, getDateByFormat() + ".log");
  let obj = {
    time: new Date(Date.now()),
    total: HierachyTree.storage,
    big_directory: listBigNode,
    root: mode == ScanMode.Normal ? HierachyTree : listBigNode
  };

  await ScanHelper.writeResultToFile(scanDir, pathJSON, obj);

  console.timeEnd("Disk-management-scanner");
}

export async function Compare(threshold: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void> {
  let listScanFile: string[] = await CompareHelper.getListScanFile(scanDir);
  CompareHelper.resolveData(scanDir, listScanFile, threshold);
  console.log("in 3 param");
}
