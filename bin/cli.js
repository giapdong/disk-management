#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const package = require('../package.json');
const { program } = require('commander');
const inquirer = require('inquirer');
const { Scan, Compare, analyze, scanDir } = require('../index.js');
const { ScanMode, CompareEngine } = require('../build/lib/interface/index');

const cliVersion = [
	colors.blue('Disk management current CLI version:'),
	colors.green(package.version),
	'\nView latest version in registry by command: ',
	colors.blue('npm view disk-management version')
].join(' ');

program.name('disk-management');
program.version(cliVersion, '-v, --version', 'Print version infomation');
program.helpOption('-h, --help', 'For more information on a command');

program
	.command('scan')
	.option('-r, --root <directory>', 'Start directory application will scan')
	.option('-t, --threshold <threshold>', 'Minimum size of directory to evaluate')
	.option('-m, --mode <mode>', "Mode scan 'SaveToDisk' | 'ReturnResult'")
	.description('Scan your disk from root')
	.action(cmd => {
		let root = cmd.root || __dirname;
		let threshold = cmd.threshold || 10000;
		let mode = ScanMode[cmd.mode] || ScanMode.SaveToDisk;
		Scan(root, threshold, mode);
	});


program
	.command('compare')
	.option('-t, --threshold <threshold>', 'Threshold compare two File | Directory')
	.option('-e, --engine <engine>', "Result engine 'JSON' | 'HTML' | 'SmartHTML'")
	.description('Compare two log file')
	.action(function (cmd) {
		let threshold = cmd.threshold || 10000;
		let engine = CompareEngine[cmd.engine] || CompareEngine.JSON;

		if (fs.existsSync(scanDir)) {
			var results = fs.readdirSync(scanDir, 'utf-8');
		} else {
			var results = [];
		}

		inquirer.prompt([
			{
				type: 'list',
				name: 'source',
				message: 'Choose source file',
				choices: results,
				filter(val) {
					return val.toLowerCase();
				}
			},
			{
				type: 'list',
				name: 'target',
				message: 'Choose target file',
				choices: results,
				filter(val) {
					return val.toLowerCase();
				}
			}
		]).then(answers => {
			var source = path.join(scanDir, answers.source);
			var target = path.join(scanDir, answers.target);

			Compare(threshold, source, target, engine);
		});
	});


program
	.command('analyze')
	.description('Analyze scan file')
	.action(function (cmd) {

		if (fs.existsSync(scanDir)) {
			var results = fs.readdirSync(scanDir, 'utf-8');
		} else {
			var results = [];
		}

		inquirer.prompt([
			{
				type: 'list',
				name: 'source',
				message: 'Choose source file',
				choices: results,
				filter(val) {
					return val.toLowerCase();
				}
			}
		]).then(answers => {
			var source = path.join(scanDir, answers.source);

			analyze(source);
		});
	});


program.parse(process.argv);
if (!program.args.length) program.help();
