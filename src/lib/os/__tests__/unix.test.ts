import os from "os";
import { PartitionNode } from "../../interface";
import { unix } from "../unix";

describe("unix os tools", () => {
  if (os.platform() == "win32") {
    test("Success", () => expect(1).toEqual(1));
    return;
  }

  test("readSystemPartition() must contain / folder", async () => {
    const partitionInfo: PartitionNode[] = await new unix().readSystemPartition();
    expect(Array.isArray(partitionInfo)).toBeTruthy();
    expect(partitionInfo.length).toBeTruthy();

    const rootMountOn = partitionInfo.find((item: PartitionNode) => item.caption === "/");
    expect(rootMountOn).toBeTruthy();
    expect(rootMountOn?.size).toBeTruthy();
  });
});
