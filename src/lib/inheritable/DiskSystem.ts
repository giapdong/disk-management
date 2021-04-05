import { PartitionNode } from "../interface";
import { ChildProcess, spawn } from "child_process";

export default abstract class DiskSystem {
  abstract readSystemPartition(): Promise<PartitionNode[]>;

  spawnCommand(command: string, options: string[]): Promise<any> {
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
  }
}
