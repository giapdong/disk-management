import { PartitionNode } from "../interface";

export default abstract class DiskSystem {
  abstract readSystemPartition(): Promise<PartitionNode[]>;
}
