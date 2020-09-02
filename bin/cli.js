#!/usr/bin/env node
// https://www.youtube.com/watch?v=q3IfiUCuZvU

const { program } = require("commander");
const package = require("../package.json");
const colors = require("colors");
const { color, ScanMode, Scan } = require("../index.js");
const { Compare } = require("../lib");

colors.setTheme(color);
const cliVersion = [
  "Disk management CLI version:".blue,
  package.version.success,
].join(" ");

program.version(cliVersion, "-v, --version", "output the current version");

program.option("-rs, --roots <directory>", "Select root directory to scan");
program
  .command("scan")
  .option("-r, --root <directory>", "Start directory application will scan")
  .option(
    "-t, --threshold <threshold>",
    "Minimum size of directory to evaluate"
  )
  .option("-m, --mode <mode>", "Mode scan 'Normal' | 'OnlyBigDirectory'")
  .description("Scan your disk")
  .action((cmd) => {
    let root = cmd.root || __dirname;
    let threshold = cmd.threshold || 10000;
    let mode = ScanMode[cmd.mode] || ScanMode.Normal;
    Scan(root, threshold, mode);
  });
program
  .command("compare")
  .option(
    "-t, --threshold <threshold>",
    "Threshold compare two File | Directory"
  )
  .description("Compare two latest log file")
  .action((cmd) => {
    let threshold = cmd.threshold || 10000;
    Compare(threshold);
  });

program.parse(process.argv);
if (!program.args.length) program.help();
