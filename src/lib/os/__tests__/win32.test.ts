import os from "os";
import { PartitionNode } from "../../interface";
import { caseToPartitionNode, readPartition } from "../win32";

describe("win32 os tools", () => {
  if (os.platform() != "win32") {
    test("Success", () => expect(1).toEqual(1));
    return;
  }
  test("caseToPartitionNode() convert success", () => {
    let partition = {
      deviceid: "C",
      freespace: "10",
      size: "11"
    };
    let result: PartitionNode = caseToPartitionNode(partition) as PartitionNode;
    expect(result).not.toBeNull();
    expect(result.freespace).toBe(10);
    expect(result.size).toBe(11);
  });

  test("caseToPartitionNode() convert failed", () => {
    let partition = {
      deviceid: "C",
      freespace: "ahihi",
      size: "ahihi"
    };
    let result = caseToPartitionNode(partition);
    expect(result).toBeNull();
  });

  test("caseToPartitionNode() convert failed", async () => {
    let partitionInfo: PartitionNode[] = await readPartition();
    expect(Array.isArray(partitionInfo)).toBeTruthy();
    expect(partitionInfo.length).toBeTruthy();
  });
});
