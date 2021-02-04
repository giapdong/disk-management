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
  describe("getListScanFile()", () => {
    test("getListScanFile() successfully", async () => {
      let data = await getListScanFile(path.join(__dirname, ".."));
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toEqual(4);
      expect(data.includes("__tests__")).toBeTruthy();
      expect(typeof data[0]).toBe("string");
    });

    test("getListScanFile() failed", async () => {
      let listScanFile = getListScanFile(__dirname + "nothing");
      await expect(listScanFile).rejects.toThrowError(/^ENOENT/);
    });
  });

  describe("resolveCompareData()", () => {
    test("resolveCompareData() successfully", async () => {
      const scanDir = path.join(__dirname, "../../../../scan");
      if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

      let json = JSON.stringify({ big_directory: [] });
      let sourceFile = path.join(scanDir, "source-log.test");
      let targetFile = path.join(scanDir, "target-log.test");

      await writeFilePromise(sourceFile, json);
      await writeFilePromise(targetFile, json);

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

      try {
        fs.unlinkSync(sourceFile);
        fs.unlinkSync(targetFile);
      } catch (err) {
        console.error(err);
      }
    });
  });
});
