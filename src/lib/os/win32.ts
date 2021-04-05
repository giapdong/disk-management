import { PartitionNode } from "../interface";
import DiskSystem from "../inheritable/DiskSystem";

export function parseData(stdout: string): PartitionNode[] {
  const parsed = stdout
    .trim()
    .split("\n")
    .slice(1)
    .map(line => {
      return line.trim().split(/\s+(?=[\d/])/);
    });

  const listPartition: PartitionNode[] = parsed.map(partition => castToPartitionNode(partition));

  return listPartition;
}

export function castToPartitionNode(partition: string[]): PartitionNode {
  const caption = partition[0];
  const freespace = parseInt(partition[1]);
  const size = parseInt(partition[2]);
  return { caption, freespace, size };
}

export class win32 extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const stdout = await this.spawnCommand("wmic", ["logicaldisk", "get", "size,freespace,caption"]);
        const listPartition = parseData(stdout);
        resolve(listPartition);
      } catch (error) {
        reject(error);
      }
    });
  }
}
