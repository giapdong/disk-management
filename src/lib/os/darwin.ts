import { ChildProcess, spawn } from "child_process";
import { DiskSystem } from "../inheritable/ASystem";
import { PartitionNode } from "../interface";

export class darwin extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise((resolve, reject) => {
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
          const arr = partition.split(/[\s,]+/);
          const usedSize = parseInt(arr[2].replace("K", "")) * 1024; // exp "300K" => 300
          const size = parseInt(arr[3].replace("K", "")) * 1024 + usedSize;
          const freespace = size - usedSize;
          const deviceid = arr[5];

          return { deviceid, size, freespace };
        });
        resolve(partitions);
      });
    });
  }
}
