import { ChildProcess, spawn } from "child_process";
import { PartitionNode } from "../interface";
import DiskSystem from "../inheritable/DiskSystem";

const spawnCommand = function (command: string, options: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // https://en.wikipedia.org/wiki/Df_(Unix)#Specification
    const ps: ChildProcess = spawn(command, options);
    if (!ps || !ps.stdout) {
      const err = new Error("Cannot spawn command!");
      return reject(err);
    }
    let ret = "";

    ps.stdout.on("data", function (data: any) {
      ret = data.toString();
    });

    ps.on("error", function (err: Error) {
      reject(err);
    });

    ps.on("close", function (code: number | null, signal: NodeJS.Signals | null) {
      resolve(ret);
    });
  });
};

export function parseData(stdout: string): PartitionNode[] {
  const listRawPartition = stdout.split("\n").filter(Boolean);
  listRawPartition.shift();

  return listRawPartition.map(partition => {
    // Parse correct format of df result
    // https://github.com/adriano-di-giovanni/node-df/blob/master/lib/parse.js
    const arr = partition
      // one or more whitespaces followed by one or more digits
      // must be interpreted as column delimiter
      .replace(/\s+(\d+)/g, "\t$1")
      // one or more whitespaces followed by a slash
      // must be interpreted as the last column delimiter
      .replace(/\s+\//g, "\t/")
      // split into columns
      .split(/\t/);

    const usedSize = parseInt(arr[2].replace(/k|K/g, "")) * 1024;
    const freespace = parseInt(arr[3].replace(/k|K/g, "")) * 1024;
    const size = freespace + usedSize;
    const caption = arr[5];

    return { caption, size, freespace };
  });
}

export class darwin extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rawPartition = await spawnCommand("df", ["-bk"]);
        const partitions = parseData(rawPartition);
        resolve(partitions);
      } catch (error) {
        reject(error);
      }
    });
  }
}
