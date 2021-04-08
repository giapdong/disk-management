import { PartitionNode } from "../interface";
import DiskSystem from "../inheritable/DiskSystem";

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

export class unix extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rawPartition = await this.spawnCommand("df", ["-bk"]);
        const partitions = parseData(rawPartition);
        resolve(partitions);
      } catch (error) {
        reject(error);
      }
    });
  }
}
