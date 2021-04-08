import { PartitionNode } from "../../interface";
import * as helper from "../helper";

const dataTest = `Filesystem    1024-blocks      Used Available Capacity  Mounted on
/dev/disk2s5    243993744  10821256 170026488     6%    /
devfs                 191       191         0   100%    /dev
/dev/disk2s1    243993744  60315728 170026488    27%    /System/Volumes/Data
/dev/disk2s4    243993744   2098196 170026488     2%    /private/var/vm
/dev/disk3s2    488164352 468563712  19600640    96%    /Volumes/HDD 500GB
/dev/disk0s3    156169212 124996040  31173172    81%    /Volumes/Untitled
map auto_home           0         0         0   100%    /System/Volumes/Data/home`;

describe("Parse data testing", () => {
  test("parseUnixData function", () => {
    const listPartitionNode: PartitionNode[] = helper.parseUnixData(dataTest);
    const firstNode = listPartitionNode[0];
    expect(listPartitionNode.length).toEqual(7);
    expect(firstNode.caption).toEqual("/");
  });
});
