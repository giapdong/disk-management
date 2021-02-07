import { bytesToSize, getDateByFormat, genDotsSpinner } from "../global-helper";

describe("Global helper", () => {
  test("bytesToSize()", () => {
    expect(bytesToSize(100)).toBe("100 Bytes");
    expect(bytesToSize(1024)).toBe("1.00 KB (1,024 Bytes)");
    expect(bytesToSize(1024 * 1024)).toBe("1.00 MB (1,048,576 Bytes)");
    expect(bytesToSize(1024 * 1024 * 2)).toBe("2.00 MB (2,097,152 Bytes)");
    expect(bytesToSize(1024 * 1024 * 1024 * 2)).toBe("2.00 GB (2,147,483,648 Bytes)");
    expect(bytesToSize(1024 * 1024 * 1024 * 1024 * 2)).toBe("2.00 TB (2,199,023,255,552 Bytes)");

    expect(bytesToSize(0)).toBe("n/a");
    expect(bytesToSize(-5)).toBe("n/a");
  });

  test("getDateByFormat()", () => {
    let nowFormat = getDateByFormat();
    expect(typeof nowFormat).toBe("string");
    expect(nowFormat.split(/(-|_|\.)/).length).toBe(11);
    expect(nowFormat.replace(/-|_|\./g, "").length).toBe(14);
  });
});
