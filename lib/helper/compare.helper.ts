import ora from "ora";
import fs from "fs";
import path from "path";
import { BigNode } from "@lib/interface";
import { getDateByFormat } from "./global.helper";
import { writeFilePromise } from "@lib/tools/filesystem";

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

export function resolveData(pathToSourceFile: string, pathToTargetFile: string, threshold: number) {
  const spinner = ora({
    text: "[2/3] Resolving result",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();

  let dataSource = fs.readFileSync(pathToSourceFile, "utf-8");
  let dataTarget = fs.readFileSync(pathToTargetFile, "utf-8");

  let json1 = JSON.parse(dataSource).big_directory as BigNode[];
  let json2 = JSON.parse(dataTarget).big_directory as BigNode[];

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

export function detectParameterCompare(
  pathToScanDir: string,
  listFileScaned: string[],
  pathToSourceFile: string | undefined,
  pathToTargetFile: string | undefined
) {
  let result = {
    pathToSourceFile: "",
    pathToTargetFile: ""
  };

  if (pathToSourceFile) result.pathToSourceFile = pathToSourceFile;
  else {
    let olderScanFile: string = listFileScaned[listFileScaned.length - 2];
    result.pathToSourceFile = path.join(pathToScanDir, olderScanFile);
  }

  if (pathToTargetFile) result.pathToTargetFile = pathToTargetFile;
  else {
    let newestScanFile: string = listFileScaned[listFileScaned.length - 1];
    result.pathToTargetFile = path.join(pathToScanDir, newestScanFile);
  }

  return result;
}

export async function storeResult(compareDir: string, data: any) {
  const spinner = ora({
    text: "[3/3] Writting result",
    spinner: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    }
  });
  spinner.start();

  if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);

  let pathJSON = path.join(compareDir, getDateByFormat() + ".log");
  var json = JSON.stringify(data, null, 4);

  await writeFilePromise(pathJSON, json);

  spinner.info("Done" + " Saved 1 new log file.");
  spinner.succeed("[2/3] Resolving result");
}
