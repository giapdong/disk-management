import os from "os";
import { PartitionNode } from "../../interface";
import { darwin } from "../darwin";

describe("darwin os tools", () => {
  if (os.platform() != "darwin") {
    test("Success", () => expect(1).toEqual(1));
    return;
  }

  test("readSystemPartition() must contain / folder", async () => {
    const partitionInfo: PartitionNode[] = await new darwin().readSystemPartition();
    expect(Array.isArray(partitionInfo)).toBeTruthy();
    expect(partitionInfo.length).toBeTruthy();

    const rootMountOn = partitionInfo.find((item: PartitionNode) => item.deviceid === "/");
    expect(rootMountOn).toBeTruthy();
    expect(rootMountOn?.size).toBeTruthy();
  });
});
