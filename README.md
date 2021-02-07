<!-- Inspired from 'word-wrap', 'ts-mocha'  -->

[![Latest Stable Version](https://img.shields.io/npm/v/disk-management.svg)](https://www.npmjs.com/package/disk-management)
[![NPM Downloads](https://img.shields.io/npm/dt/disk-management.svg)](https://www.npmjs.com/package/disk-management)
[![NPM Downloads](https://img.shields.io/npm/dm/disk-management.svg)](https://www.npmjs.com/package/disk-management)

[![Dependency Status](https://img.shields.io/david/piotrwitek/disk-management.svg)](https://david-dm.org/piotrwitek/disk-management)
[![peerDependency Status](https://img.shields.io/david/peer/piotrwitek/disk-management.svg)](https://david-dm.org/piotrwitek/disk-management#info=devDependencies)
[![LICENSE](https://img.shields.io/npm/l/disk-management.svg?sanitize=true)](https://www.npmjs.com/package/disk-management)

# Disk management with Nodejs

Module/CLI application management storage your disk

## Installation

```bash
# yarn
$ yarn add disk-management
#npm
$ npm install disk-management
```

## Table of Contents

<ul>
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
    <li><a href="#cli">CLI</a></li>
</ul>

## Importing

```javascript
const DiskManagement = require("disk-management");
```

If you need micro function, import with ES6 systax

```javascript
const { color, ScanMode, Scan, Compare } = require("disk-management");
```

## Usage

Base guide for application

### Simple demo

Create 1 `<file-name>`.js, here we create file run.js

```javascript
const { Scan, ScanMode } = require("disk-management");

Scan(__dirname, 10000, ScanMode.OnlyBigDirectory);
```

Or you need compare change in your disk

```javascript
const { Compare } = require("disk-management");

Compare(10000);
```

Run application

```bash
node run.js
```

## API

### Scan

`Scan(directory, threshold, mode)`

@directory: `String` Path to root directory you want scan

@threshold: `Number` Minimum number(Bytes) you want application filter your child folder

@[mode](#scanmode): `ScanMode` Mode to scan

### Compare

`Compare(threshold)`

@threshold: `Number` Minimum file size changed of each File same position
Default compare two last time

### ScanMode

Type: `Enum`

Values: `Normal | OnlyBigDirectory`

Description: In `Normal` mode, application will store all infomation of tree directory. Else with `OnlyBigDirectory` mode, application will store only folder with size of `all file in that folder`.

For example, you have folder with 3 file and 5 folder, we will calcute size of folder same as size of 3 file.

## CLI

We built-in with cli command. See help follow below guide.

If you use yarn as package management, you can install disk-management cli as dependencies in your nodejs application. Run cli follow command: `yarn disk-management`

If you use npm, you need install **disk-management** in global. Run cli follow command: `disk-management`

# Issues

If you using npm version 5.6.0 or appear [Not support version 10.15.x](https://github.com/nodejs/help/issues/1877) [Cannot install ts-node-dev](https://github.com/wclr/ts-node-dev/issues/224). Please upgrage to newest version npm

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020, Giap Dong
