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
import { unix } from "./os/unix";
import { linux } from "./os/linux";
import DiskSystem from "./inheritable/DiskSystem";

const scanDir = path.join(__dirname, "..", "..", "scan");
const compareDir = path.join(__dirname, "..", "..", "compare");

export async function Scan(): Promise<DiskScanResult>;
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

  const listChangeStatus = CompareHelper.resolveCompareData(paramCompare);

  await CompareHelper.storeResult(compareDir, listChangeStatus);
  console.timeEnd("Disk-management-compare");
}

export function readSystemPartition(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let diskInstance: DiskSystem;
    switch (os.platform()) {
      case "win32":
        diskInstance = new win32();
      case "linux":
        diskInstance = new linux();
      default:
        diskInstance = new unix();
    }

    const data = diskInstance.readSystemPartition();
    resolve(data);
  });
}
