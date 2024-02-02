import { TypeNodeHierachy, ScanMode } from "../Enum";

describe("Enum test", () => {
  test("TypeNodeHierachy enum", () => {
    const fileType: TypeNodeHierachy = TypeNodeHierachy.File;
    const directoryType: TypeNodeHierachy = TypeNodeHierachy.Directory;

    expect(fileType).toEqual(0);
    expect(directoryType).toEqual(1);
  });

  test("ScanMode enum", () => {
    const saveToDisk: ScanMode = ScanMode.SaveToDisk;
    const returnResult: ScanMode = ScanMode.ReturnResult;

    expect(saveToDisk).toEqual(1);
    expect(returnResult).toEqual(2);
  });
});
