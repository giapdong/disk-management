import { Stats } from "fs";
import { TypeNodeHierachy, ScanMode, StatsNode, BigNode, IOptionsCompare, ChangeNode, PartitionNode } from "../index";

describe("Interface test", () => {
  test("TypeNodeHierachy enum", () => {
    const fileType: TypeNodeHierachy = TypeNodeHierachy.File;
    const directoryType: TypeNodeHierachy = TypeNodeHierachy.Directory;

    expect(fileType).toEqual(0);
    expect(directoryType).toEqual(1);
  });

  test("ScanMode enum", () => {
    const normalMode: ScanMode = ScanMode.Normal;
    const bigNodeMode: ScanMode = ScanMode.OnlyBigDirectory;

    expect(normalMode).toEqual(1);
    expect(bigNodeMode).toEqual(2);
  });

  test("StatsNode interface", () => {
    const statNode: StatsNode = { path: "path/to/file", stats: new Stats() };

    expect(typeof statNode.path).toEqual("string");
    expect(statNode.stats instanceof Stats).toBeTruthy();
    expect(statNode.path).toEqual("path/to/file");
  });

  test("BigNode interface", () => {
    const bigNode: BigNode = { path: "path/to/file", storage: 1000 };

    expect(typeof bigNode.path).toEqual("string");
    expect(typeof bigNode.storage).toEqual("number");
    expect(bigNode.path).toEqual("path/to/file");
    expect(bigNode.storage).toEqual(1000);
  });

  test("IOptionsCompare interface", () => {
    const optionsCompare: IOptionsCompare = {
      threshold: 1000,
      pathToSourceFile: "path/to/src",
      pathToTargetFile: "path/to/target"
    };

    expect(typeof optionsCompare.threshold).toEqual("number");
    expect(typeof optionsCompare.pathToSourceFile).toEqual("string");
    expect(typeof optionsCompare.pathToTargetFile).toEqual("string");

    expect(optionsCompare.threshold).toEqual(1000);
    expect(optionsCompare.pathToSourceFile).toEqual("path/to/src");
    expect(optionsCompare.pathToTargetFile).toEqual("path/to/target");
  });

  test("ChangeNode interface", () => {
    const node: ChangeNode = { name: "node name", change: -100 };

    expect(typeof node.name).toEqual("string");
    expect(typeof node.change).toEqual("number");
    expect(node.name).toEqual("node name");
    expect(node.change).toEqual(-100);
  });

  test("PartitionNode interface", () => {
    const partition: PartitionNode = { caption: "C", freespace: 2000, size: 5000 };

    expect(typeof partition.caption).toEqual("string");
    expect(typeof partition.size).toEqual("number");
    expect(typeof partition.freespace).toEqual("number");

    expect(partition.caption).toEqual("C");
    expect(partition.size).toEqual(5000);
    expect(partition.freespace).toEqual(2000);
  });
});
