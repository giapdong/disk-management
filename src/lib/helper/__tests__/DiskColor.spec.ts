import DiskColor from "../DiskColor";
const str = "AHIHI";

const getKeyColor = (str: string, colorKey: number) => {
  return `\x1b[1m\x1b[${colorKey}m` + str + "\x1b[39m\x1b[22m";
};

describe("DiskColor class", () => {
  test("blue color", () => {
    expect(DiskColor.blue(str) == getKeyColor(str, 34)).toBeTruthy();
  });

  test("red color", () => {
    expect(DiskColor.red(str) == getKeyColor(str, 31)).toBeTruthy();
  });

  test("green color", () => {
    expect(DiskColor.green(str) == getKeyColor(str, 32)).toBeTruthy();
  });
});
