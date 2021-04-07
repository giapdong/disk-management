import { Stats } from "fs";

export * from "./ScanResult";

export * from "./Enum";

export * from "./Type";

export * from "./NodeInPathName";

// interface
export interface StatsNode {
  path: string;
  stats: Stats;
}

export interface BigNode {
  path: string;
  storage: number;
}

export interface IOptionsCompare {
  threshold: number;
  pathToSourceFile: string;
  pathToTargetFile: string;
}

export interface ChangeNode {
  name: string;
  change: number;
}

export interface PartitionNode {
  caption: string;
  size: number;
  freespace: number;
}
