const fs = require("fs");
const path = require("path");
const colors = require("colors");
const _ = require("lodash");
const Hierachy = require("./Hierachy");
colors.setTheme({
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red",
});

const scanDir = path.join(__dirname, "..", "scan");
const compareDir = path.join(__dirname, "..", "compare");
let HierachyTree = null;

/**
 * Read element into dir with path: pathDir
 *
 * @param {String} pathDir Path to directory
 */
async function readDirPromise(pathDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathDir, "utf-8", function (err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
}

/**
 * Read stat of element by fs.stat with Promise
 *
 * @param {String} pathNode Path to directory
 * @param {String} element Name of element wanna read stat
 */
async function readStatPromise(pathNode, element) {
  return new Promise((resolve, reject) => {
    if (element === "System Volume Information") {
      return reject(new Error("Cannot read system infomation"));
    } else {
      fs.stat(path.join(pathNode, element), function (err, data) {
        return err ? reject(err) : resolve(data);
      });
    }
  });
}

/**
 * Đọc các file/dir có trong thư mục có đường dẫn là pathNode, thông tin được lưu lại tại rootNode
 * @param {Object} rootNode Là gốc của một cây thư mục
 * @param {String} pathNode Đường dẫn đến cây thư mục tương ứng - rootNode
 */
async function readFromRoot(rootNode, pathNode) {
  return new Promise(async (resolve, reject) => {
    let set = new Set();
    // Timeout for task.
    var intervalID = setInterval(async () => {
      if (set.size == 0) {
        resolve(rootNode.storage);
        clearInterval(intervalID);
      }
    }, 100);

    //Scan all item into directory with path pathNode
    let result = await readDirPromise(pathNode);
    result.forEach(async (element) => {
      // console.log(path.join(pathNode, element))

      // add element to set for break condition
      set.add(element);

      //Read stat of element
      let stats = await readStatPromise(pathNode, element);

      if (stats && stats.name != "Error") {
        let type = stats.isFile() ? "File" : "Directory";
        let n = new Hierachy(rootNode, path.join(pathNode, element), 0, type);
        rootNode.addChild(n);

        if (type == "File") {
          n.addStorage(stats.size);
          set.delete(element);
        }

        if (type == "Directory") {
          let result = await readFromRoot(n, path.join(pathNode, element));
          set.delete(element);
        }
      }
    });
  });
}

/**
 * Tìm các thư mục có dung lượng >= threshold từ rootNode
 * @param {Object} rootNode Object là cây thư mục tổng
 * @param {Number} threshold Ngưỡng - tiêu chí để lựa chọn các thư mục
 */
async function scanBigDirectory(rootNode, threshold) {
  let arrayBigDir = [];
  return new Promise(function (resolve, reject) {
    var count = 0;
    const intervalID = setInterval(() => {
      count++;
      if (count === 5) {
        resolve(arrayBigDir);
        clearInterval(intervalID);
      }
    }, 10);

    var tempStroge = 0;

    rootNode.child.forEach(async (element) => {
      count = 0;
      if (element.type === "File") {
        tempStroge += element.storage;
      } else scanBigDirectory(element, threshold);
    });
    if (tempStroge > threshold)
      arrayBigDir.push({ name: rootNode.name, storage: tempStroge });
  });
}

/**---------------------------------------------------//--------------------------------------------------//
|----------------------------------------------------//--------------------------------------------------//
\---------------------------------------------------//--------------------------------------------------*/

/**
 * Function loại bỏ hết các thuộc tính parent thành null => phục vụ việc convert thành JSON.
 * @param {Object} root Là root object - Hierachy.
 */
async function removeParent(root) {
  root.parent = null;
  root.child.forEach(async (element) => {
    element.parent = null;
    if (element.type == "Directory") removeParent(element);
  });
}

/**
 * This is function use process.stdout print with color and format beautiful
 * @param {String} data
 */
function printScreen(data) {
  let count = 0;
  const intervalID = setInterval(async () => {
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
    count = (count + 1) % 4;
    var dots = new Array(count + 1).join(".");
    process.stdout.write(data + dots); // write text
  }, 200);

  function stop() {
    clearInterval(intervalID);
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
    process.stdout.write(data + "...\n");
  }

  return { intervalID, stop };
}

/**
 * This is function scan
 * @param {String} root Root directory
 * @param {Number} big Value of big directory wanna show
 */
async function Scan(root = __dirname, big = 1000) {
  console.time("Disk-management-scanner");
  HierachyTree = new Hierachy(null, root, 0, "Directory");

  let interval = printScreen("[1/4] Scanning");
  let totalStorage = await readFromRoot(HierachyTree, root);
  interval.stop();
  console.log(`Total storage: ${totalStorage.toLocaleString()} Bytes`);

  interval = printScreen("[2/4] Scanning big directory");
  let dataScanBig = await scanBigDirectory(HierachyTree, big);
  interval.stop();

  interval = printScreen("[3/4] Formatting data");
  removeParent(HierachyTree);
  interval.stop();

  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
  let date = ("00" + now.getDate()).slice(-2);
  let hour = ("00" + now.getHours()).slice(-2);
  let minutes = ("00" + now.getMinutes()).slice(-2);
  let second = ("00" + now.getSeconds()).slice(-2);
  let currentDate = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;
  let pathJSON = path.join(
    scanDir,
    `${year}-${month}-${date}_${hour}.${minutes}.${second}.log`
  );

  var obj = {
    time: currentDate,
    big_directory: dataScanBig,
    root: HierachyTree,
  };
  // var json = JSON.stringify(obj, null, 4)
  let json = JSON.stringify(obj);

  interval = printScreen("[4/4] Writting result");
  let writedBytes = await (function () {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathJSON, json, function (err) {
        return resolve(err);
      });
    });
  })();
  interval.stop();

  console.log("Finish".success + " Saved 1 new log file.");
  console.timeEnd("Disk-management-scanner");
}

/**
 * This is function scan and write only big directory
 * @param {String} root Root directory
 * @param {Number} big Value of big directory wanna show
 */
async function ScanAndFilter(root = __dirname, big = 1000) {
  console.time("Scan & Filter");
  HierachyTree = new Hierachy(null, root, 0, "Directory");

  let interval = printScreen("[1/4] Scanning");
  let totalStorage = await readFromRoot(HierachyTree, root);
  interval.stop();
  console.log(`Total storage: ${totalStorage.toLocaleString()} Bytes`);

  interval = printScreen("[2/4] Scanning big directory");
  let dataScanBig = await scanBigDirectory(HierachyTree, big);
  interval.stop();

  interval = printScreen("[3/4] Formatting data");
  removeParent(HierachyTree);
  interval.stop();

  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
  let date = ("00" + now.getDate()).slice(-2);
  let hour = ("00" + now.getHours()).slice(-2);
  let minutes = ("00" + now.getMinutes()).slice(-2);
  let second = ("00" + now.getSeconds()).slice(-2);
  let currentDate = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;
  let pathJSON = path.join(
    scanDir,
    `${year}-${month}-${date}_${hour}.${minutes}.${second}.log`
  );

  var obj = { time: currentDate, big_directory: dataScanBig };
  var json = JSON.stringify(obj, null, 4);

  interval = printScreen("[4/4] Writting result");
  let writedBytes = await (function () {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathJSON, json, function (err) {
        return resolve(err);
      });
    });
  })();
  interval.stop();

  console.log("Finish".success + " Saved 1 new log file.");
  console.timeEnd("Scan & Filter");
}

/**
 * Compare two file log
 * @param {Number} threshold Threshold for change folder
 */
async function Compare(threshold) {
  let interval = printScreen("[1/3] Reading result");
  let result = fs.readdirSync(scanDir); //Scan all file log in scanDir
  interval.stop();

  if (result.length < 3) {
    console.log("Too little file in scan directory");
    return;
  }

  interval = printScreen("[2/3] Resolving result");
  let path1 = path.join(scanDir, result[result.length - 3]);
  let path2 = path.join(scanDir, result[result.length - 2]);

  let data1 = fs.readFileSync(path1, "utf-8");
  let data2 = fs.readFileSync(path2, "utf-8");

  let json1 = JSON.parse(data1);
  let json2 = JSON.parse(data2);

  let data = _.reduce(
    json2.big_directory,
    (result, value, key) => {
      let item = _.find(json1.big_directory, (item) => item.name == value.name);
      if (item != null && item.name) {
        let change = value.storage - item.storage;
        if (change > 10) result.push({ ...value, storage: change });
      } else result.push(value);

      return result;
    },
    []
  );
  interval.stop();

  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
  let date = ("00" + now.getDate()).slice(-2);
  let hour = ("00" + now.getHours()).slice(-2);
  let minutes = ("00" + now.getMinutes()).slice(-2);
  let second = ("00" + now.getSeconds()).slice(-2);
  let pathJSON = path.join(
    compareDir,
    `${year}-${month}-${date}_${hour}.${minutes}.${second}.log`
  );

  var json = JSON.stringify(data, null, 4);
  interval = printScreen("[3/3] Writting result");
  fs.writeFileSync(pathJSON, json, "utf-8");
  interval.stop();
  console.log("Done".success + " Saved 1 new log file.");
}

module.exports = {
  Scan,
  ScanAndFilter,
  Compare,
};
