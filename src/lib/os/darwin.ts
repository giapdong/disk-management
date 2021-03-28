import { ChildProcess, spawn } from "child_process";
import { DiskSystem } from "../inheritable/ASystem";
import { PartitionNode } from "../interface";

export class darwin extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise((resolve, reject) => {
      // https://en.wikipedia.org/wiki/Df_(Unix)#Specification
      const ps: ChildProcess = spawn("df", ["-bk"]);
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
        const listRawPartition = ret.split("\n").filter(Boolean);
        listRawPartition.shift();

        const partitions = listRawPartition.map(partition => {
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
        resolve(partitions);
      });
    });
  }
}
