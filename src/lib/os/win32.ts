import { exec } from "child_process";
import { PartitionNode } from "../interface";
import DiskSystem from "../inheritable/DiskSystem";

// Idea from https://github.com/Alex-D/check-disk-space/blob/master/index.js
export function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) return reject(error);

      try {
        resolve(stdout as string);
      } catch (error) {
        reject(error);
      }
    });
  });
}

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
      const stdout = await execCommand("wmic logicaldisk get size,freespace,caption");
      const listPartition = parseData(stdout);
      resolve(listPartition);
    });
  }
}
