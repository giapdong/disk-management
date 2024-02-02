<!-- Inspired from 'word-wrap', 'ts-mocha'  -->

[![Latest Stable Version](https://img.shields.io/npm/v/disk-management.svg)](https://www.npmjs.com/package/disk-management)
[![NPM Downloads](https://img.shields.io/npm/dt/disk-management.svg)](https://www.npmjs.com/package/disk-management)
[![NPM Downloads](https://img.shields.io/npm/dm/disk-management.svg)](https://www.npmjs.com/package/disk-management)
[![LICENSE](https://img.shields.io/npm/l/disk-management.svg)](https://www.npmjs.com/package/disk-management)

# Disk management with Nodejs

Module/CLI application management storage your disk

Typescript code-base

## Installation

```bash
npm install disk-management # Or yarn add disk-management
```

## Table of Contents

<ul>
	<li><a href="#cli">CLI Guide</a></li>
	<li><a href="#importing">Importing</a></li>
	<li>
		<a href="#usage">Usage</a>
		<ul>
			<li><a href="#simple-demo">Simple demo</a></li>
		</ul>
	</li>
	<li>
		<a href="#api">API</a>
		<ul>
			<li><a href="#scan">Scan</a></li>
			<li><a href="#compare">Compare</a></li>
			<li><a href="#scanmode">ScanMode</a></li>
		</ul>
	</li>
	<li><a href="#issues">Issues</a></li>
</ul>

## CLI

We built-in with powerful cli command.

First thing first, `disk-management` will helpful when install as **global** module

### Scan directory CLI
And now, you should be focus to first and most common task: `Scan`.
```bash
disk-management scan --root "C:\\" --threshold 1024
```

Command above will scan all file in `"C:\\"` and report all file size `> 1024B (1KB)`. Special notice: Total storage value still equal total files. See in below example, value of directory contain 2 files still equal 3000 Bytes, but only file `tsconfig.json` will report to files for optimize file size
```
.
├── tsconfig.json (2000 Bytes)
└── yarn.lock (1000 Bytes)
```

### Analyze disk CLI
After you using scan command, you will have demand for see overview all files and `big files/folders` e.g question for **How much size of temporary folder?** will have answer by this feature
```bash
disk-management analyze

? Choose source file (Use arrow keys)
> 2023-01-28_09.38.56.sys0.log.xjson
  2023-01-28_10.20.39.sys1.json.xjson
  2023-07-13_15.08.28.sys2.json.xjson
  2023-08-07_09.59.53.sys3.json.xjson
  2023-09-07_17.23.07.sys4.json.xjson
  2024-02-02_14.49.49.json.xjson
  2024-02-02_14.54.48.json.xjson
```


## Importing

```javascript
const DiskManagement = require('disk-management');
```

If you need micro function, import with ES6 systax

```javascript
const { ScanMode, Scan, Compare } = require('disk-management');
```

## API Usage

Base guide for application

### Simple demo

Create 1 `<file-name>`.js, here we create file run.js

```javascript
const { Scan, ScanMode } = require('disk-management');

Scan(__dirname, 10000, ScanMode.OnlyBigDirectory);
```

Or you need compare change in your disk

```javascript
const { Compare } = require('disk-management');

Compare(10000);
```

Run application

```bash
node run.js
```

## API References

### Scan

`Scan(directory?, threshold?, mode?)`

| Parameter | Type     | Description                                                         | Default Value                                                                       |
| --------- | -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| directory | string   | Path to root directory you want scan                                | \_\_dirname of this module (most case it has value: ./node_modules/disk-management) |
| threshold | number   | Minimum number(Bytes) you want application filter your child folder | 1000000                                                                             |
| mode      | ScanMode | [ScanMode](#scanmode) Mode you want scan                            | ScanMode.Normal                                                                     |

### Compare

`Compare(threshold?, pathToSourceFile?, pathToTargetFile?)`

| Parameter        | Type   | Description                                           | Default Value             |
| ---------------- | ------ | ----------------------------------------------------- | ------------------------- |
| threshold        | number | Minimum file size changed of each File same position  | 1000000                   |
| pathToSourceFile | string | Path to source file you want compare with target file | 2nd from last in scan dir |
| pathToTargetFile | string | Path to target file you want compare                  | 1nd from last in scan dir |

### ScanMode

Type: `Enum`

Values: `Normal | OnlyBigDirectory`

Description: In `Normal` mode, application will store all infomation of tree directory. Else with `OnlyBigDirectory` mode, application will store only folder with size of `all file in that folder`.

For example, you have folder with 3 file and 5 folder, we will calcute size of folder same as size of 3 file.

# Development
[NPM parameter](https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script)

```bash
npm run run -- --version
npm run run -- scan -r "C:\\"
```

# Issues

If you using npm version 5.6.0 or appear [Not support version 10.15.x](https://github.com/nodejs/help/issues/1877) [Cannot install ts-node-dev](https://github.com/wclr/ts-node-dev/issues/224). Please upgrage to newest version npm

If using Apache for serve HTML result, notice with error related authz_core: [ServerFault](https://serverfault.com/questions/418101/apache-client-denied-by-server-configuration-despite-allowing-access-to-direc)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020, Giap Dong
