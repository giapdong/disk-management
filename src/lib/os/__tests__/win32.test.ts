import os from "os";
import { PartitionNode } from "../../interface";
import { castToPartitionNode, win32 } from "../win32";

describe("win32 os tools", () => {
  if (os.platform() != "win32") {
    test("Success", () => expect(1).toEqual(1));
    return;
  }

  test("castToPartitionNode() convert success", () => {
    const partition = ["C", "10", "11"];
    const result: PartitionNode = castToPartitionNode(partition) as PartitionNode;
    expect(result).not.toBeNull();
    expect(result.freespace).toBe(10);
    expect(result.size).toBe(11);
  });

  test("castToPartitionNode() convert failed", () => {
    const partition = ["C", "ahihi", "ahihi"];
    const result = castToPartitionNode(partition);

    expect(isNaN(result.freespace)).toBeTruthy();
    expect(isNaN(result.size)).toBeTruthy();
  });

  test("readSystemPartition() must contain system partition", async () => {
    const partitionInfo: PartitionNode[] = await new win32().readSystemPartition();
    expect(Array.isArray(partitionInfo)).toBeTruthy();
    expect(partitionInfo.length).toBeTruthy();
  });
});
