import Hierachy from "../../bean/Hierachy";
import { ScanResult } from "../ScanResult";
import { TypeNodeHierachy } from "../Enum";

describe("Interface test", () => {
  test("ScanResult interface", () => {
    const rootHierachy = new Hierachy(null, __dirname, 10, TypeNodeHierachy.Directory);
    const scanResult: ScanResult = { time: new Date(Date.now()), total: 1000, threshold: 999, bigDirectory: [], root: rootHierachy };

    expect(scanResult.time instanceof Date).toBeTruthy();
    expect(typeof scanResult.total).toEqual("number");
    expect(typeof scanResult.threshold).toEqual("number");
    expect(scanResult.root instanceof Hierachy).toBeTruthy();
  });
});
