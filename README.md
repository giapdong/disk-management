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
</ul>

## Importing

```javascript
const DiskManagement = require("disk-management");
```

## Usage

Base guide for application

### Simple demo

Create 1 `<file-name>`.js, here we create file run.js

```javascript
const DiskManagement = require("disk-management");

DiskManagement.Scan(__dirname, 10000, DiskManagement.ScanMode.OnlyBigDirectory);
```

Run application

```bash
node run.js
```

## API

### Scan

`DiskManagement.Scan(directory, threshold, mode)`

@directory: `String` Path to root directory you want scan

@threshold: `Number` Minimum number(Bytes) you want application filter your child folder

@[mode](#scanmode): `ScanMode` Mode to scan

### Compare

`DiskManagement.Compare()`
Default compare two last time

### ScanMode

Type: `Enum`

Values: `Normal | OnlyBigDirectory`

Description: In `Normal` mode, application will store all infomation of tree directory. Else with `OnlyBigDirectory` mode, application will store only folder with size of `all file in that folder`. For example, you have folder with 3 file and 5 folder, we will calcute size of folder same as size of 3 file.

## CLI

We built-in with cli command
See detail please type: npm disk-management
