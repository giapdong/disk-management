import { Hierachy } from "../../bean/node-hierachy";
import {
  scanInFileSystem,
  scanBigDirectoryInHierachy,
  removeParentInHierachy,
  writeResultToFile
} from "../scan-helper";
import { BigNode } from "../../interface";
import path from "path";
import fs from "fs";

jest.mock("ora", () => {
  // https://stackoverflow.com/questions/61022114/mock-ora-with-jest-to-see-if-it-was-called
  const fn = jest.fn();
  const result = { start: fn, fail: fn, succeed: fn, info: fn };
  const ora = jest.fn(() => result);
  return ora;
});

describe("Scan helper", () => {
  let rootHierachy: Hierachy;
  test("Init data", async () => {
    rootHierachy = await scanInFileSystem(path.join(__dirname, ".."));
  });

  test("scanInFileSystem()", async () => {
    expect(rootHierachy).not.toBeNull();
    expect(rootHierachy.child.length).toBe(6);
  });

  test("scanBigDirectoryInHierachy()", async () => {
    let listBigNode: BigNode[] = await scanBigDirectoryInHierachy(rootHierachy, 100);
    expect(Array.isArray(listBigNode)).toBeTruthy();
    expect(typeof listBigNode[0].path).toBe("string");
    expect(typeof listBigNode[0].storage).toBe("number");

    let listBigNodeNoneChild: BigNode[] = await scanBigDirectoryInHierachy(rootHierachy, Number.POSITIVE_INFINITY);
    expect(Array.isArray(listBigNodeNoneChild)).toBeTruthy();
    expect(listBigNodeNoneChild.length).toBe(0);
  });

  test("removeParentInHierachy()", async () => {
    let newHierachyNoneParent: Hierachy = await removeParentInHierachy(rootHierachy);
    expect(newHierachyNoneParent.parent).toBeNull();

    newHierachyNoneParent.child.forEach(child => {
      expect(child.parent).toBeNull();
    });
  });

  test("writeResultToFile()", async () => {
    const scanDir = path.join(__dirname, "../../../../scan");
    let sourceFile = path.join(scanDir, "source-log.test");
    let writePromise = writeResultToFile(scanDir, sourceFile, { name: "giapdong" });

    await expect(writePromise).resolves.toBe(undefined);
  });

  test("Cleanup test data", async () => {
    const scanDir = path.join(__dirname, "../../../../scan");
    let sourceFile = path.join(scanDir, "source-log.test");
    fs.unlinkSync(sourceFile);
  });
});
