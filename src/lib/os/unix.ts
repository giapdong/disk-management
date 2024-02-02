import { PartitionNode } from "../interface";
import DiskSystem from "../inheritable/DiskSystem";
import * as helper from "./helper";

export class unix extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rawPartition = await this.spawnCommand("df", ["-bk"]);
        const partitions = helper.parseUnixData(rawPartition);
        resolve(partitions);
      } catch (error) {
        reject(error);
      }
    });
  }
}
