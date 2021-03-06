import fs from "fs";
import path from "path";
import colors from "colors";
import { BigNode, ChangeNode, IOptionsCompare } from "../interface";
import { getDateByFormat, genDotsSpinner } from "./global-helper";
import { lsCommandPromise, writeFilePromise } from "../tools/filesystem";

export async function getListScanFile(pathToScanDir: string): Promise<string[]> {
  const spinner = genDotsSpinner("[1/3] Reading result");
  spinner.start();

  let listScanFile: string[];
  try {
    listScanFile = await lsCommandPromise(pathToScanDir);
  } catch (error) {
    spinner.fail(error.message);
    throw error;
  }

  if (listScanFile.length < 2) {
    spinner.fail(`[1/3] Failed, too little log file in ${pathToScanDir}`);
    throw new Error(`[1/3] Failed, too little log file in ${pathToScanDir}`);
  }
  spinner.succeed("[1/3] Reading result");
  return listScanFile;
}

export function resolveCompareData(compareOptions: IOptionsCompare): ChangeNode[] {
  const spinner = genDotsSpinner("[2/3] Resolving result");
  spinner.start();

  let dataSource = fs.readFileSync(compareOptions.pathToSourceFile, "utf-8");
  let dataTarget = fs.readFileSync(compareOptions.pathToTargetFile, "utf-8");

  let json1 = JSON.parse(dataSource).big_directory as BigNode[];
  let json2 = JSON.parse(dataTarget).big_directory as BigNode[];

  let listBigNode: string[] = json1.map(item => item.path).concat(json2.map(item => item.path));
  listBigNode = [...new Set(listBigNode)];

  let listChangeStatus: ChangeNode[] = [];

  listBigNode.forEach(node => {
    let nodeInJSON1 = json1.find(item => item.path == node);
    let nodeInJSON2 = json2.find(item => item.path == node);

    if (nodeInJSON1 && nodeInJSON2) {
      let change: number = nodeInJSON1?.storage - nodeInJSON2?.storage;
      if (Math.abs(change) > compareOptions.threshold) listChangeStatus.push({ name: node, change: change });
    } else if (nodeInJSON1 || nodeInJSON2) {
      let change: number = 0;
      if (nodeInJSON1) change = nodeInJSON1.storage;
      if (nodeInJSON2) change = -nodeInJSON2.storage;

      if (Math.abs(change) > compareOptions.threshold) listChangeStatus.push({ name: node, change: change });
    }
  });

  spinner.succeed("[2/3] Resolving result");
  return listChangeStatus;
}

export async function detectOptionsCompare(
  threshold: number,
  pathToScanDir: string,
  pathToSourceFile: string | undefined,
  pathToTargetFile: string | undefined
): Promise<IOptionsCompare> {
  let optionsCompare: IOptionsCompare = { threshold, pathToSourceFile: "", pathToTargetFile: "" };
  let listScanFile: string[];

  try {
    listScanFile = await getListScanFile(pathToScanDir);
  } catch (error) {
    throw error;
  }

  if (pathToSourceFile) optionsCompare.pathToSourceFile = pathToSourceFile;
  else {
    let olderScanFile: string = listScanFile[listScanFile.length - 2];
    optionsCompare.pathToSourceFile = path.join(pathToScanDir, olderScanFile);
  }

  if (pathToTargetFile) optionsCompare.pathToTargetFile = pathToTargetFile;
  else {
    let newestScanFile: string = listScanFile[listScanFile.length - 1];
    optionsCompare.pathToTargetFile = path.join(pathToScanDir, newestScanFile);
  }

  return optionsCompare;
}

export async function storeResult(compareDir: string, data: any) {
  const spinner = genDotsSpinner("[3/3] Writting result");
  spinner.start();

  if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);

  let pathJSON = path.join(compareDir, getDateByFormat() + ".log");
  var json = JSON.stringify(data, null, 4);
  try {
    await writeFilePromise(pathJSON, json);
  } catch (error) {
    throw error;
  }

  spinner.info(colors.green("Done!") + " Saved 1 new log file.");
  spinner.succeed("[3/3] Writting result");
}
