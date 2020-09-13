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
    let packageStart = package.scripts.start.split(" ");
    let pathServer = packageStart[1];
    let pathAbsoluteServer = path.resolve(__dirname, "../", pathServer);
    let commandExec = `npx ${packageStart[0]} ${pathAbsoluteServer}`;

    let { stdout, stderr } = await exec(commandExec);
    stdout.on("data", (data) => {
      console.log(data.toString());
    });
  });

program.parse(process.argv);
if (!program.args.length) program.help();
