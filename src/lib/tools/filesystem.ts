import { StatsNode } from "../interface";
import fs from "fs";
import path from "path";

/**
 * Simulation ls command familiar in UNIX, LINUX system
 *
 * @param {string} pathToDir Path to node in filesystem
 */
export function lsCommandPromise(pathToDir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDir, "utf-8", function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
}

/**
 * Get directory status of element in dir
 *
 * @param pathToDir Path to one DIRECTORY in filesystem
 * @param dirInfo List item that dir contrain it
 */
export async function readStatDirPromise(pathToDir: string, dirInfo: string[]): Promise<StatsNode[]> {
  try {
    let promise: Promise<StatsNode>[] = [];
    dirInfo.forEach(element => {
      promise.push(readStatPromise(path.join(pathToDir, element)));
    });

    let listStat: StatsNode[] = await Promise.all(promise);
    return listStat;
  } catch (error) {
    console.log(error);
    let newDirInfo = dirInfo.filter(item => path.join(pathToDir, item) != error.path);
    if (!newDirInfo.length) return [];

    let listStat: StatsNode[] = await readStatDirPromise(pathToDir, newDirInfo);
    return listStat;
  }
}

/**
 * Write file using Promise
 *
 * @param {String} path Path to directory contain file
 * @param {JSON} data Stringtify of Object
 */
export function writeFilePromise(path: string, data: any, options = "utf-8") {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, options, error => {
      if (error) return reject(error);
      resolve(1);
    });
  });
}

/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */

/**
 * Get status of FILE or DIRECTORY in filesystem
 *
 * @param {string} pathToNode Path to node in filesystem
 */
async function readStatPromise(pathToNode: string): Promise<StatsNode> {
  return new Promise((resolve, reject) => {
    fs.stat(pathToNode, function(err, data) {
      let nodeStat: StatsNode = { path: pathToNode, stats: data };
      return err ? reject(err) : resolve(nodeStat);
    });
  });
}
