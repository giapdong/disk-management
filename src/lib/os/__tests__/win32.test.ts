import os from "os";
import { PartitionNode } from "../../interface";
import { castToPartitionNode, win32 } from "../win32";

describe("win32 os tools", () => {
  if (os.platform() != "win32") {
    test("Success", () => expect(1).toEqual(1));
    return;
  }
  test("castToPartitionNode() convert success", () => {
    let partition = {
      caption: "C",
      freespace: "10",
      size: "11"
    };
    let result: PartitionNode = castToPartitionNode(partition) as PartitionNode;
    expect(result).not.toBeNull();
    expect(result.freespace).toBe(10);
    expect(result.size).toBe(11);
  });

  test("castToPartitionNode() convert failed", () => {
    let partition = {
      caption: "C",
      freespace: "ahihi",
      size: "ahihi"
    };
    let result = castToPartitionNode(partition);
    expect(result).toBeNull();
  });

  test("readSystemPartition() must contain system partition", async () => {
    let partitionInfo: PartitionNode[] = await new win32().readSystemPartition();
    expect(Array.isArray(partitionInfo)).toBeTruthy();
    expect(partitionInfo.length).toBeTruthy();
  });
});
