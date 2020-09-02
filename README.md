# Disk management with Nodejs

Module/CLI application management storage your disk

## Installation

```bash
# yarn
yarn add giapdong/disk-management
#npm
npm install giapdong/disk-management
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
