#!/usr/bin/env node

const path = require("path");
const colors = require("colors");
const package = require("../package.json");
const { exec } = require("child_process");
const { program } = require("commander");
const { color, ScanMode, Scan, Compare } = require("../index.js");

colors.setTheme(color);
const cliVersion = [
  "Disk management current CLI version:".blue,
  package.version.success,
  "\nView latest version in registry: ",
  "npm view disk-management version".blue,
].join(" ");

program.version(cliVersion, "-v, --version", "Print version infomation");
program.helpOption("-h, --help", "For more information on a command");

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
  .description("Open webapp for UI/UX application")
  .action(async (cmd) => {
    const { spawn } = require("child_process");

    let startScript = package.scripts.start.split(/\s+/);
    let rawScript = startScript.slice(1);
    rawScript = rawScript.map(
      (item) =>
        item
          .replace(/[:']/g, " ")
          .trim()
          .split(/\s+/)[1]
    );
    rawScript = rawScript.map((item) => ({
      name: item,
      script: package.scripts[item].split(/\s+/),
    }));
    rawScript = rawScript.map((item) => {
      item.script[0] = item.script[0] == "nodemon" ? "node" : item.script[0];
      item.script[1] = path.resolve(__dirname, "..", item.script[1]);
      item.script = item.script.join(" ");
      return item;
    });

    rawScript.forEach((element) => {
      var child = spawn(element.script, { shell: true });
      child.stdout.on("data", (data) => {
        console.log(`[${element.name}]`.success, data.toString());
      });
    });
  });

program.parse(process.argv);
if (!program.args.length) program.help();
