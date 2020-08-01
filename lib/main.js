const fs = require("fs");
const path = require("path");
const colors = require("colors");
const _ = require("lodash");
const ora = require("ora");
const Hierachy = require("./Hierachy");
global.emitter = new (require("events").EventEmitter)();

colors.setTheme({
  success: "green",
  warn: "yellow",
  debug: "blue",
  error: "red",
});

const scanDir = path.join(__dirname, "..", "scan");
const compareDir = path.join(__dirname, "..", "compare");
const spinner = ora({
  text: "[1/4] Scanning",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
});
const ScanType = Object.freeze({ Normal: 1, OnlyBigDirectory: 2 });
const EventType = Object.freeze({
  Scan: "1",
  FilterBigDirectory: "2",
  WriteResult: "3",
});

let HierachyTree = null;
const userParam = {
  bigDirectory: 1000,
  mode: ScanType.Normal,
};

/**
 * Communicate event-oriented
 * Invoke when scan task return with success = true;
 *
 */
emitter.on(EventType.Scan, async () => {
  spinner.succeed("[1/4] Scanning");
  console.log(`Total storage: ${HierachyTree.storage.toLocaleString()} Bytes`);
  emitter.emit(EventType.FilterBigDirectory);
});

/**
 * Communicate event-oriented
 * Invoke when push notification to cmd
 * Filter big directory
 *
 */
emitter.on(EventType.FilterBigDirectory, async () => {
  spinner.text = "[2/4] Scanning big directory";
  spinner.start();
  let dataScanBig = await scanBigDirectory(
    HierachyTree,
    userParam.bigDirectory
  );
  spinner.succeed("[2/4] Scanning big directory");
  emitter.emit(EventType.WriteResult, dataScanBig);
});

/**
 * Communicate event-oriented
 * Write result after filter to file
 *
 */
emitter.on(EventType.WriteResult, async (dataScanBig) => {
  spinner.text = "[3/4] Formatting data";
  spinner.start();
  removeParent(HierachyTree);
  spinner.succeed("[3/4] Formatting data");

  let pathJSON = path.join(scanDir, getDateByFormat() + ".log");
  console.log(pathJSON);
  let obj = {
    time: new Date(Date.now()),
    big_directory: dataScanBig,
    root: userParam.mode == ScanType.Normal ? HierachyTree : dataScanBig,
  };

  spinner.text = "[4/4] Writting result";
  spinner.start();

  // JSON.stringify(obj, null, 4)
  await writeFilePromise(pathJSON, JSON.stringify(obj));
  spinner.succeed("[4/4] Writting result");

  console.log("Finish".success + " Saved 1 new log file.");
  console.timeEnd("Disk-management-scanner");
});

/**
 * Write file using Promise
 *
 * @param {String} path Path to directory contain file
 * @param {JSON} data Stringtify of Object
 */
async function writeFilePromise(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, function (err) {
      return err ? resolve(err) : resolve();
    });
  });
}

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
 * Read File | Directory has in directory <pathNode>, store info to rootNode
 *
 * @param {Object} rootNode Root of tree node current
 * @param {String} pathNode Absolute path to node
 */
async function readFromRoot(rootNode, pathNode) {
  //Scan all item into directory with path: pathNode
  let dirInfo;
  try {
    dirInfo = await readDirPromise(pathNode);
  } catch (error) {
    dirInfo = error;
  }

  if (dirInfo && dirInfo.name != "Error") {
    dirInfo.forEach(async (element) => {
      //Read stat of element
      let stats;
      try {
        stats = await readStatPromise(pathNode, element);
      } catch (error) {
        stats = error;
      }

      if (stats && stats.name != "Error") {
        let type = stats.isFile() ? "File" : "Directory";
        let n = new Hierachy(rootNode, path.join(pathNode, element), 0, type);
        rootNode.addChild(n);

        if (type == "File") {
          n.addStorage(stats.size);
        }

        if (type == "Directory") {
          await readFromRoot(n, path.join(pathNode, element));
        }
      }
    });
  }
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
 * Return string like YYYY-MM-DD_HH.MM.SS
 *
 */
function getDateByFormat() {
  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
  let date = ("00" + now.getDate()).slice(-2);
  let hour = ("00" + now.getHours()).slice(-2);
  let minutes = ("00" + now.getMinutes()).slice(-2);
  let second = ("00" + now.getSeconds()).slice(-2);
  return `${year}-${month}-${date}_${hour}.${minutes}.${second}`;
}

/**
 * Function remove reference parent of Hierachy = null => enable convert to JSON
 *
 * @param {Object} root Root object - HierachyTree.
 */
async function removeParent(root) {
  root.parent = null;
  root.child.forEach(async (element) => {
    element.parent = null;
    if (element.type == "Directory") removeParent(element);
  });
}

/**
 * Function scan from root directory
 *
 * @param {String} root Root directory | Default: __dirname
 * @param {Number} big Trigger value to show directory with storage > big(Bytes) | Default: 1000 Bytes
 *
 */
async function Scan(root = __dirname, big = 1000, mode = ScanType.Normal) {
  userParam.bigDirectory = big;
  userParam.mode = mode;

  console.time("Disk-management-scanner");
  HierachyTree = new Hierachy(null, root, 0, "Directory");
  Object.defineProperty(HierachyTree, "storage", {
    get() {
      return this._storage || 0;
    },
    set(value) {
      this.resetTimeout();
      this._storage = value;
    },
  });

  HierachyTree.countDown();
  spinner.start();
  readFromRoot(HierachyTree, root);
}

/**
 * Compare two file log
 *
 * @param {Number} threshold Threshold for change folder | Default: 1000 Bytes
 */
async function Compare(threshold = 1000) {
  spinner.text = "[1/3] Reading result";
  spinner.start();
  let result = fs.readdirSync(scanDir); //Scan all file log in scanDir
  spinner.succeed("[1/3] Reading result");

  if (result.length < 3) {
    console.log("Too little file in scan directory");
    return;
  }

  spinner.text = "[2/3] Resolving result";
  spinner.start();
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
  spinner.succeed("[2/3] Resolving result");

  let pathJSON = path.join(compareDir, getDateByFormat() + ".log");

  var json = JSON.stringify(data, null, 4);

  spinner.text = "[3/3] Writting result";
  spinner.start();
  fs.writeFileSync(pathJSON, json, "utf-8");
  spinner.succeed("[2/3] Resolving result");

  console.log("Done".success + " Saved 1 new log file.");
}

module.exports = {
  ScanType,

  Scan,
  Compare,
};
