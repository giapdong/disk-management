import DiskError from "../DiskError";

describe("DiskError class", () => {
  test("DiskError instance of Error", () => {
    expect(new DiskError(new Error()) instanceof Error).toBeTruthy();
  });

  test("DiskError instance match with error param", () => {
    const error = {
      message: "new error",
      path: "/Users/nothing",
      isPublic: false
    };
    const diskError = new DiskError(error);

    expect(diskError instanceof Error).toBeTruthy();
    expect(diskError.message).toEqual(error.message);
    expect(diskError["path"]).toEqual(error.path);
    expect(diskError["isPublic"]).toEqual(error.isPublic);
  });
});
