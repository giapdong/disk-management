import DiskFileSystem from "../DiskFileSystem";
import path from "path";
import fs from "fs";

describe("File system tool", () => {
  let lsData: any;
  let pathToDir = path.join(__dirname, "..");
  test("Init data", async () => {
    lsData = await new DiskFileSystem().lsCommandPromise(pathToDir);
  });

  test("lsCommandPromise()", async () => {
    expect(Array.isArray(lsData)).toBeTruthy();
    expect(lsData.length).toBe(2);
    expect(typeof lsData[0]).toBe("string");
  });

  test("readStatDirPromise()", async () => {
    let listStatInDir = await new DiskFileSystem().readStatDirPromise(pathToDir, lsData);
    expect(Array.isArray(listStatInDir)).toBeTruthy();
    expect(listStatInDir.length).toBe(2);
    expect(typeof listStatInDir[0]).toBe("object");
    expect(typeof listStatInDir[0].path).toBe("string");
  });

  test("writeFilePromise()", async () => {
    let scanDir = path.join(__dirname, "../../../../scan");
    let fileName = path.join(scanDir, "source.test");
    let result = await new DiskFileSystem().writeFilePromise(fileName, "Hello world");
    expect(result).toBeTruthy();

    let rejectResult = new DiskFileSystem().writeFilePromise(fileName, "Hello world", "giapdong");
    await expect(rejectResult).rejects.toThrowError();

    fs.unlinkSync(fileName);
  });
});
