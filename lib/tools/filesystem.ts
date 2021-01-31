import { StatsNode } from "@root/types";
import fs from "fs";
import path from "path";

/**
 * Simulation ls command familiar in UNIX, LINUX system
 *
 * @param pathToDir Path to node in filesystem
 */
export async function lsCommandPromise(pathToDir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDir, "utf-8", function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
}

/**
 * Read stat of element in dir
 *
 * @param pathToDir Path to one DIRECTORY in filesystem
 * @param dirInfo List item that dir contrain it
 */
export async function readStatDirPromise(pathToDir: string, dirInfo: string[]): Promise<StatsNode[]> {
  try {
    let promise: any[] = [];
    dirInfo.map(element => {
      promise.push(readStatPromise(path.join(pathToDir, element)));
    });
    let listStat: StatsNode[] = await Promise.all(promise);
    return listStat;
  } catch (error) {
    console.log(error);
    let newDirInfo = dirInfo.filter(item => path.join(pathToDir, item) != error.path);
    let listStat: StatsNode[] = await readStatDirPromise(pathToDir, newDirInfo);
    return listStat;
  }
}

/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */

/**
 * Read info of FILE or DIRECTORY in filesystem
 *
 * @param pathToNode Path to node in filesystem
 */
async function readStatPromise(pathToNode: string): Promise<StatsNode> {
  return new Promise((resolve, reject) => {
    fs.stat(pathToNode, function(err, data) {
      let nodeStat: StatsNode = { path: pathToNode, stats: data };
      return err ? reject(err) : resolve(nodeStat);
    });
  });
}
