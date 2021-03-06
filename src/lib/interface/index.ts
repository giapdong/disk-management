import { Stats } from "fs";

// enum type
export enum TypeNodeHierachy {
  File,
  Directory
}

export enum ScanMode {
  Normal = 1,
  OnlyBigDirectory = 2
}

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
