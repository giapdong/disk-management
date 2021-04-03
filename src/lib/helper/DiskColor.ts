export default class DiskColor {
  static red(str: string) {
    return "\x1b[1m\x1b[31m" + str + "\x1b[39m\x1b[22m";
  }

  static green(str: string) {
    return "\x1b[1m\x1b[32m" + str + "\x1b[39m\x1b[22m";
  }

  static blue(str: string) {
    return "\x1b[1m\x1b[34m" + str + "\x1b[39m\x1b[22m";
  }
}
