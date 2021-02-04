import { getListScanFile, resolveCompareData, detectOptionsCompare, storeResult } from "../compare-helper";
import path from "path";

jest.mock("ora", () => {
  // https://stackoverflow.com/questions/61022114/mock-ora-with-jest-to-see-if-it-was-called
  const fn = jest.fn();
  const result = { start: fn, fail: fn, succeed: fn, info: fn };
  const ora = jest.fn(() => result);
  return ora;
});

describe("Compare helper", () => {
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
