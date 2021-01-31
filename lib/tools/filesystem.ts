import fs from "fs";
import path from "path";

export async function lsCommandPromise(pathToDir: string) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDir, "utf-8", function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
}

export async function readStatDirPromise(rootPath: string, dirInfo: string[]) {
  try {
    let promise: any[] = [];
    dirInfo.map(element => {
      promise.push(readStatPromise(rootPath, element));
    });
    let listStat = await Promise.all(promise);
    return listStat;
  } catch (error) {
    console.log(error);
    let newDirInfo = dirInfo.filter(item => path.join(rootPath, item) != error.path);
    // return await readStatDirPromise(rootPath, newDirInfo);
  }
}

/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */
/* ********************************************************************************************************* */

async function readStatPromise(rootPath: string, element: string) {
  return new Promise((resolve, reject) => {
    fs.stat(path.join(rootPath, element), function(err, data) {
      console.log("stat: ", data);
      return err ? reject(err) : resolve({ name: element, data });
    });
  });
}
