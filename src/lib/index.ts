import os from "os";
import path from "path";
import { BigNode, IOptionsCompare, ScanMode, DiskScanResult } from "./interface";
import Hierachy from "./bean/Hierachy";
import DiskError from "./bean/DiskError";
import ConsoleErrorHandler from "./bean/ConsoleErrorHandler";
import { getDateByFormat } from "./helper/global-helper";
import * as CompareHelper from "./helper/compare-helper";
import * as ScanHelper from "./helper/scan-helper";
import { win32 } from "./os/win32";
import { darwin } from "./os/darwin";

const scanDir = path.join(__dirname, "..", "..", "scan");
const compareDir = path.join(__dirname, "..", "..", "compare");

export async function Scan(root: string): Promise<DiskScanResult>;
export async function Scan(root: string, threshold: number): Promise<DiskScanResult>;
export async function Scan(root: string, threshold: number, mode: ScanMode): Promise<DiskScanResult>;
export async function Scan(root: string = __dirname, threshold: number = 1048576, mode: ScanMode = ScanMode.SaveToDisk): Promise<DiskScanResult> {
  console.time("Disk-management-scanner");

  let HierachyTree: Hierachy = await ScanHelper.scanInFileSystem(root);
  const listBigNode: BigNode[] = await ScanHelper.scanBigDirectoryInHierachy(HierachyTree, threshold);
  HierachyTree = await ScanHelper.removeParentInHierachy(HierachyTree);

  const pathJSON = path.join(scanDir, getDateByFormat() + ".json");
  const diskResult: DiskScanResult = {
    time: new Date(Date.now()),
    total: HierachyTree.storage,
    threshold,
    bigDirectory: listBigNode,
    root: HierachyTree
  };

  if (mode == ScanMode.ReturnResult) {
    console.timeEnd("Disk-management-scanner");
    return diskResult;
  }

  await ScanHelper.writeResultToFile(scanDir, pathJSON, diskResult);
  console.timeEnd("Disk-management-scanner");
  return null;
}

export async function Compare(threshold: number): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string, pathToTargetFile: string): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void> {
  console.time("Disk-management-compare");

  let paramCompare: IOptionsCompare;
  try {
    paramCompare = await CompareHelper.detectOptionsCompare(threshold, scanDir, pathToSourceFile, pathToTargetFile);
  } catch (error) {
    new ConsoleErrorHandler(new DiskError(error));
    return;
  }

  let listChangeStatus = CompareHelper.resolveCompareData(paramCompare);

  await CompareHelper.storeResult(compareDir, listChangeStatus);
  console.timeEnd("Disk-management-compare");
}

export function readSystemPartition(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    switch (os.platform()) {
      case "win32": {
        const data = await new win32().readSystemPartition();
        return resolve(data);
      }

      case "darwin": {
        const data = await new darwin().readSystemPartition();
        return resolve(data);
      }

      default:
        resolve(null);
        break;
    }
  });
}
