import { Stats } from "fs";
import { NodeSizing } from "./Sizing";

export * from "./ScanResult";

export * from "./Enum";

export * from "./Type";

export * from "./NodeInPathName";

export * from "./Sizing";

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
  change: NodeSizing;
}

export interface PartitionNode {
  caption: string;
  size: number;
  freespace: number;
}
