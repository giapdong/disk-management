import { PartitionNode } from "../interface";

export abstract class DiskSystem {
  abstract readSystemPartition(): Promise<PartitionNode[]>;
}
