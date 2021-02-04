import path from "path";
import { BigNode, IOptionsCompare, ScanMode } from "./interface";
import { Hierachy } from "./bean/node-hierachy";
import { getDateByFormat } from "./helper/global-helper";
import * as CompareHelper from "./helper/compare-helper";
import * as ScanHelper from "./helper/scan-helper";

const scanDir = path.join(__dirname, "..", "..", "scan");
const compareDir = path.join(__dirname, "..", "..", "compare");

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

  let paramCompare: IOptionsCompare | null = await CompareHelper.detectOptionsCompare(
    threshold,
    scanDir,
    pathToSourceFile,
    pathToTargetFile
  );
  if (!paramCompare) return;
  console.log(paramCompare);

  let listChangeStatus = CompareHelper.resolveCompareData(paramCompare);

  await CompareHelper.storeResult(compareDir, listChangeStatus);
  console.timeEnd("Disk-management-compare");
}
