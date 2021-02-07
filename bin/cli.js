#!/usr/bin/env node

const path = require("path");
const colors = require("colors");
const package = require("../package.json");
const { program } = require("commander");
const { Scan, Compare } = require("../index.js");
const { ScanMode } = require("../build/lib/interface/index");

const cliVersion = [
  colors.blue("Disk management current CLI version:"),
  colors.green(package.version),
  "\nView latest version in registry: ",
  colors.blue("npm view disk-management version")
].join(" ");

program.name("disk-management");
program.version(cliVersion, "-v, --version", "Print version infomation");
program.helpOption("-h, --help", "For more information on a command");

program
  .command("scan")
  .option("-r, --root <directory>", "Start directory application will scan")
  .option("-t, --threshold <threshold>", "Minimum size of directory to evaluate")
  .option("-m, --mode <mode>", "Mode scan 'Normal' | 'OnlyBigDirectory'")
  .description("Scan your disk from root")
  .action(cmd => {
    let root = cmd.root || __dirname;
    let threshold = cmd.threshold || 10000;
    let mode = ScanMode[cmd.mode] || ScanMode.Normal;
    Scan(root, threshold, mode);
  });

program
  .command("compare")
  .option("-t, --threshold <threshold>", "Threshold compare two File | Directory")
  .description("Compare two latest log file")
  .action(cmd => {
    let threshold = cmd.threshold || 10000;
    Compare(threshold);
  });

program.parse(process.argv);
if (!program.args.length) program.help();
