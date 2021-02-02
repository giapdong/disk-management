import { Stats } from "fs";

export enum TypeNodeHierachy {
  File,
  Directory
}

export enum ScanMode {
  Normal = 1,
  OnlyBigDirectory = 2
}

export interface StatsNode {
  path: string;
  stats: Stats;
}

export interface BigNode {
  path: string;
  storage: number;
}

export const color = {
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red"
};
