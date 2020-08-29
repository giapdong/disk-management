# Disk management với Nodejs

Là một module mình tự chế để quản lý việc phình to dung lượng bất thường.

### Cách sử dụng

---

###### Clone từ github

```bash
git clone https://github.com/giapdong/disk-management.git
cd disk-management
code .
```

Tạo 1 `<file-name>`.js, ở đây mình tạo file test.js

```javascript
const disk = require("./lib/index.js");
const myConst = require("./lib/const.js");

disk.Scan(__dirname, 10000, myConst.ScanMode.OnlyBigDirectory);
```

Run chương trình test

```bash
node test.js
```

###### Install là một dependencies trong project

```bash
# yarn
yarn add giapdong/disk-management
#npm
npm install giapdong/disk-management
```

Tạo 1 `<file-name>`.js, ở đây mình tạo file index.js

```javascript
const disk = require("disk-management");
const diskManagement = disk.diskManagement;
const myConst = disk.d_Const;

diskManagement.Scan(__dirname, 10000, myConst.ScanMode.OnlyBigDirectory);
```

Run chương trình

```bash
node index.js
```

### API `Work In Process`

---

Scan `Function`
Quét một lượt từ thư mục được truyền vào

Compare `Function`
So sánh hai lần quét và tìm kiếm sự chênh lệch

---

Const
ScanMode `Enum`
EventType `Enum`
