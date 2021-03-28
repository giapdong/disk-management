import { ChildProcess, exec } from "child_process";
import { DiskSystem } from "../inheritable/ASystem";
import { PartitionNode } from "../interface";

export class win32 extends DiskSystem {
  readSystemPartition(): Promise<PartitionNode[]> {
    return new Promise((resolve, reject) => {
      const getPartition: ChildProcess = exec("wmic logicaldisk get deviceid, freespace, size");

      getPartition.stdout?.on("data", (data: Buffer | string | any) => {
        let rawDataPartition: string[] = data.split("\r\r\n").filter((item: string) => item);
        let tablePartition: Array<string[]> = rawDataPartition.map((item: string) => item.trim().split(/\s+/gm));

        let headerTable: string[] = tablePartition.length ? (tablePartition.shift() as string[]) : [];
        headerTable = headerTable ? headerTable : [];
        headerTable = headerTable.map((item: string) => item.toLowerCase());

        let listPartition: PartitionNode[] = new Array<PartitionNode>();

        tablePartition.forEach((partition: string[]) => {
          let temp = Object.fromEntries(
            partition.map((value: string, index: number) => {
              return [headerTable[index], value];
            })
          );
          let node: PartitionNode | null = castToPartitionNode(temp);
          if (node) listPartition.push(node as PartitionNode);
        });
        resolve(listPartition);
      });
    });
  }
}

export function castToPartitionNode(partition: any): PartitionNode | null {
  if (!Object.prototype.hasOwnProperty.call(partition, "deviceid")) return null;
  if (!Object.prototype.hasOwnProperty.call(partition, "freespace")) return null;
  if (!Object.prototype.hasOwnProperty.call(partition, "size")) return null;
  if (isNaN(+partition.freespace)) return null;
  if (isNaN(+partition.size)) return null;

  let node: PartitionNode = { caption: partition.deviceid, freespace: +partition.freespace, size: +partition.size };
  return node;
}
