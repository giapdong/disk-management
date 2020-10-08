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
    let pathAPI = "../webapp/api/bin/www";
    let pathClient = "../webapp/client/bin/www";

    let rawScript = [
      {
        name: "API",
        script: path.join(__dirname, pathAPI),
      },
      {
        name: "Client",
        script: path.join(__dirname, pathClient),
      },
    ];
    rawScript = rawScript.map((item) => ({
      name: item.name,
      script: `node ${item.script}`,
    }));

    rawScript.forEach((element) => {
      var child = spawn(element.script, { shell: true });
      child.stdout.on("data", (data) => {
        console.log(`[${element.name}]`.success, data.toString());
      });
    });
  });

program.parse(process.argv);
if (!program.args.length) program.help();
