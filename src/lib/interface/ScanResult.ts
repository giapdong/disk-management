import { BigNode } from ".";
import Hierachy from "../bean/Hierachy";

export interface ScanResult {
  time: Date;
  total: number;
  threshold: number;
  bigDirectory: Array<BigNode>;
  root: Hierachy;
}
