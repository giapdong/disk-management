import { getListScanFile, resolveCompareData, detectOptionsCompare, storeResult } from "../compare-helper";
import path from "path";
import fs from "fs";
import { writeFilePromise } from "../../tools/filesystem";
import { IOptionsCompare, ChangeNode } from "../../interface";

jest.mock("ora", () => {
  // https://stackoverflow.com/questions/61022114/mock-ora-with-jest-to-see-if-it-was-called
  const fn = jest.fn();
  const result = { start: fn, fail: fn, succeed: fn, info: fn };
  const ora = jest.fn(() => result);
  return ora;
});

describe("Compare helper", () => {
  const scanDir = path.join(__dirname, "../../../../scan");
  let sourceFile = path.join(scanDir, "source-log.test");
  let targetFile = path.join(scanDir, "target-log.test");

  test("Init data into scan folder", async () => {
    if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);
    let json = JSON.stringify({ big_directory: [] });
    await writeFilePromise(sourceFile, json);
    await writeFilePromise(targetFile, json);
  });

  describe("getListScanFile()", () => {
    test("getListScanFile() success", async () => {
      let data = await getListScanFile(path.join(__dirname, ".."));
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toEqual(6);
      expect(data.includes("__tests__")).toBeTruthy();
      expect(typeof data[0]).toBe("string");
    });

    test("getListScanFile() failed", async () => {
      let listScanFile = getListScanFile(__dirname + "nothing");
      await expect(listScanFile).rejects.toThrowError(/^ENOENT/);
    });
  });

  describe("resolveCompareData()", () => {
    test("resolveCompareData() success", async () => {
      let compareOptions: IOptionsCompare = {
        threshold: 1000,
        pathToSourceFile: sourceFile,
        pathToTargetFile: targetFile
      };

      let listChangeStatus: ChangeNode[] = await resolveCompareData(compareOptions);
      expect(Array.isArray(listChangeStatus)).toBeTruthy();
      if (listChangeStatus.length) {
        let shouldChangeNode = listChangeStatus[0];
        expect(typeof shouldChangeNode.name).toEqual("string");
        expect(typeof shouldChangeNode.change).toEqual("number");
      }
    });
  });

  describe("detectOptionsCompare()", () => {
    test("detectOptionsCompare() 2 param", async () => {
      let compareOptions: IOptionsCompare = await detectOptionsCompare(1000, scanDir, undefined, undefined);
      expect(compareOptions).not.toBeNull();
      expect(typeof compareOptions.threshold).toBe("number");
      expect(typeof compareOptions.pathToSourceFile).toBe("string");
      expect(typeof compareOptions.pathToTargetFile).toBe("string");
    });

    test("detectOptionsCompare() 3 param", async () => {
      let compareOptions: IOptionsCompare = await detectOptionsCompare(1000, scanDir, "hihi", undefined);
      expect(compareOptions).not.toBeNull();
      expect(typeof compareOptions.threshold).toBe("number");
      expect(typeof compareOptions.pathToSourceFile).toBe("string");
      expect(typeof compareOptions.pathToTargetFile).toBe("string");
    });

    test("detectOptionsCompare() 4 param", async () => {
      let compareOptions: IOptionsCompare = await detectOptionsCompare(1000, scanDir, "hihi", "ahihi");
      expect(compareOptions).not.toBeNull();
      expect(typeof compareOptions.threshold).toBe("number");
      expect(typeof compareOptions.pathToSourceFile).toBe("string");
      expect(typeof compareOptions.pathToTargetFile).toBe("string");
    });
  });

  test("storeResult()", async () => {
    const compareDir = path.join(__dirname, "../../../../compare");
    if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);
    await storeResult(compareDir, { name: "giapdong" });
  });

  test("Remove test file in scan folder", async () => {
    fs.unlinkSync(sourceFile);
    fs.unlinkSync(targetFile);
  });
});
