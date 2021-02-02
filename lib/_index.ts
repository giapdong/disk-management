import path from "path";
import { BigNode, ScanMode } from "@lib/interface";
import { Hierachy } from "@lib/bean/node-hierachy";
import { getDateByFormat } from "@lib/helper/global-helper";
import * as CompareHelper from "@lib/helper/compare-helper";
import * as ScanHelper from "@lib/helper/scan-helper";

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

export async function Compare(threshold: number): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string, pathToTargetFile: string): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void> {
  console.time("Disk-management-compare");

  let listScanFile: string[] = await CompareHelper.getListScanFile(scanDir);
  if (!listScanFile.length) return;

  let paramCompare = CompareHelper.detectParameterCompare(scanDir, listScanFile, pathToSourceFile, pathToTargetFile);
  let listChangeStatus = CompareHelper.resolveCompareData(
    paramCompare.pathToSourceFile,
    paramCompare.pathToTargetFile,
    threshold
  );

  await CompareHelper.storeResult(compareDir, listChangeStatus);
  console.timeEnd("Disk-management-compare");
}
