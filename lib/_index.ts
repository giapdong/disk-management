import fs, { Stats } from "fs";
import path from "path";
import colors from "colors";
import ora from "ora";
import { BigNode, ScanMode, StatsNode, TypeNodeHierachy, color } from "@root/types";
import { Hierachy } from "@lib/bean/NodeHierachy";
import { bytesToSize, getDateByFormat } from "@lib/helper/global.helper";
import * as ScanHelper from "@lib/helper/scan.helper";
import * as FS_TOOLS from "@lib/tools/filesystem";

colors.setTheme(color);
const spinner = ora({
  text: "[1/4] Scanning",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  }
});
const scanDir = path.join(__dirname, "..", "scan");
const compareDir = path.join(__dirname, "..", "compare");

export async function Scan(root = __dirname, threshold = 1000000, mode = ScanMode.Normal) {
  console.time("Disk-management-scanner");

  let HierachyTree: Hierachy = new Hierachy(null, root, 0, TypeNodeHierachy.Directory);
  spinner.start();
  await ScanHelper.scanHierachyNode(spinner, HierachyTree);
  spinner.succeed("[1/4] Scanning");

  console.log(`Total storage: ${bytesToSize(HierachyTree.storage)}`);

  spinner.text = "[2/4] Scanning big directory";
  spinner.start();
  let listBigNode: BigNode[] = ScanHelper.getBigDirectoryFromRootHierachy(HierachyTree, threshold);
  console.log(`\n${listBigNode.length} directory contrain total file file size >= ${threshold}`);
  spinner.succeed("[2/4] Scanning big directory\n");

  spinner.text = "[3/4] Formatting data";
  spinner.start();
  ScanHelper.removeParent(HierachyTree);
  spinner.succeed("[3/4] Formatting data");

  let pathJSON = path.join(scanDir, getDateByFormat() + ".log");
  let obj = {
    time: new Date(Date.now()),
    total: HierachyTree.storage,
    big_directory: listBigNode,
    root: mode == ScanMode.Normal ? HierachyTree : listBigNode
  };

  spinner.text = "[4/4] Writting result";
  spinner.start();

  try {
    //Create scanDir
    if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

    // JSON.stringify(obj, null, 4)
    await FS_TOOLS.writeFilePromise(pathJSON, JSON.stringify(obj));
    spinner.succeed("[4/4] Writting result");

    console.log("Finish" + " Saved 1 new log file.");
    console.timeEnd("Disk-management-scanner");
  } catch (error) {
    spinner.fail("[4/4] Writting result");

    console.log("Failed" + " Write file log return with Errror");
    console.timeEnd("Disk-management-scanner");
  }

  console.timeEnd("Disk-management-scanner");
  process.exit();
}
