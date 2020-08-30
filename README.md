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
    <li>
        <li><a href="#importing">Importing</a></li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#clone-from-github">Clone from github</a></li>
            <li><a href="#install-as-dependencies-in-your-project">Install as dependencies in your project</a></li>
        </ul>
    </li>
    <li><a href="#api">API</a></li>
</ul>

## Importing

```javascript
const DiskManagement = require("disk-management");
```

## Usage

Base guide for application

### Install as dependencies in your project

Create 1 `<file-name>`.js, here we create file run.js

```javascript
const disk = require("disk-management");
const diskManagement = disk.diskManagement;
const myConst = disk.d_Const;

diskManagement.Scan(__dirname, 10000, myConst.ScanMode.OnlyBigDirectory);
```

Run application

```bash
node run.js
```

## API

## `Work In Process`

Scan `Function`
Quét một lượt từ thư mục được truyền vào

Compare `Function`
So sánh hai lần quét và tìm kiếm sự chênh lệch

Const
ScanMode `Enum`
EventType `Enum`
