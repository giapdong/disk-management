import ora from "ora";
import fs from "fs";
import path from "path";
import { BigNode } from "@lib/interface";

export async function Compare(threshold: number): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string): Promise<void>;
export async function Compare(threshold: number, pathToSourceFile: string, pathToTargetFile: string): Promise<void>;

export async function Compare(threshold: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void> {
  console.log("in compare function");
}

export async function getListScanFile(pathToScanDir: string): Promise<string[]> {
  const spinner = ora({
    text: "[1/3] Reading result",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();
  let result: string[] = fs.readdirSync(pathToScanDir); //Scan all file log in scanDir

  if (result.length < 2) {
    spinner.fail(`[1/3] Failed, too little log file in ${pathToScanDir}`);
    return [];
  }
  spinner.succeed("[1/3] Reading result");
  return result;
}

export async function resolveData(pathToScanDir: string, listScanFile: string[], threshold: number) {
  const spinner = ora({
    text: "[2/3] Resolving result",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();
  let path1 = path.join(pathToScanDir, listScanFile[listScanFile.length - 2]); // older
  let path2 = path.join(pathToScanDir, listScanFile[listScanFile.length - 1]); // newer

  let data1 = fs.readFileSync(path1, "utf-8");
  let data2 = fs.readFileSync(path2, "utf-8");

  let json1 = JSON.parse(data1).big_directory as BigNode[];
  let json2 = JSON.parse(data2).big_directory as BigNode[];

  let listBigNode: string[] = json1.map(item => item.path).concat(json2.map(item => item.path));
  listBigNode = [...new Set(listBigNode)];

  let listChangeStatus: any[] = [];

  listBigNode.forEach(node => {
    let nodeInJSON1 = json1.find(item => item.path == node);
    let nodeInJSON2 = json2.find(item => item.path == node);

    if (nodeInJSON1 && nodeInJSON2) {
      let change: number = nodeInJSON1?.storage - nodeInJSON2?.storage;
      if (Math.abs(change) > threshold) listChangeStatus.push({ name: node, change: change });
    } else if (nodeInJSON1 || nodeInJSON2) {
      let change: number = 0;
      if (nodeInJSON1) change = nodeInJSON1.storage;
      if (nodeInJSON2) change = nodeInJSON2.storage;

      if (Math.abs(change) > threshold) listChangeStatus.push({ name: node, change: change });
    }
  });

  spinner.succeed("[2/3] Resolving result");

  return listChangeStatus;
}
