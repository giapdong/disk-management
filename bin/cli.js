#!/usr/bin/env node

const { program } = require("commander");
const package = require("../package.json");
const colors = require("colors");
const path = require("path");
const { exec } = require("child_process");
const { color, ScanMode, Scan, Compare } = require("../index.js");
const { stderr } = require("process");

colors.setTheme(color);
const cliVersion = [
  "Disk management latest CLI version:".blue,
  package.version.success,
].join(" ");

program.version(cliVersion, "-v, --version", "output the current version");

program
  .command("scan")
  .option("-r, --root <directory>", "Start directory application will scan")
  .option(
    "-t, --threshold <threshold>",
    "Minimum size of directory to evaluate"
  )
  .option("-m, --mode <mode>", "Mode scan 'Normal' | 'OnlyBigDirectory'")
  .description("Scan your disk from root")
  .action((cmd) => {
    let root = cmd.root || __dirname;
    let threshold = cmd.threshold || 10000;
    let mode = ScanMode[cmd.mode] || ScanMode.Normal;
    Scan(root, threshold, mode);
  });
program.helpOption("-h, --help", "output usage information");
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

program
  .command("open")
  .description("Open HTML file for UI/UX application")
  .action((cmd) => {
    exec(`npm start`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  });

program.parse(process.argv);
if (!program.args.length) program.help();
