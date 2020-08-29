const fs = require("fs");
const path = require("path");
const colors = require("colors");
const _ = require("lodash");
const ora = require("ora");
const myConst = require("./const.js");
const { resolve } = require("path");
const Hierachy = require("./Hierachy").Hierachy;
global.emitter = new (require("events").EventEmitter)();

colors.setTheme(myConst.color);
const ScanType = myConst.ScanMode;
const EventType = myConst.EventType;

const scanDir = path.join(__dirname, "..", "scan");
const compareDir = path.join(__dirname, "..", "compare");
const spinner = ora({
  text: "[1/4] Scanning",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
});

let HierachyTree = null;
let safe_instance = null;
const userParam = {
  bigDirectory: 1000000,
  mode: ScanType.Normal,
};

/**
 * Communicate event-oriented
 * Invoke when scan task finish
 *
 */
emitter.on(EventType.ScanDone, async () => {
  spinner.succeed("[1/4] Scanning");
  console.log(`Total storage: ${HierachyTree.storage.toLocaleString()} Bytes`);
  emitter.emit(EventType.FilterBigDirectoryStart);
});

/**
 * Communicate event-oriented
 * Filter big directory
 *
 */
emitter.on(EventType.FilterBigDirectoryStart, async () => {
  spinner.text = "[2/4] Scanning big directory";
  spinner.start();
  safe_instance = new (require("./Hierachy").SafeDirectory)({});
  scanBigDirectory(HierachyTree, userParam.bigDirectory);
});

/**
 * Communicate event-oriented
 * Invoke when done task scan big directory
 *
 */
emitter.on(EventType.FilterBigDirectoryFinish, async () => {
  spinner.succeed("[2/4] Scanning big directory");
  emitter.emit(EventType.WriteResult, safe_instance);
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
  let obj = {
    time: new Date(Date.now()),
    big_directory: dataScanBig,
    root: userParam.mode == ScanType.Normal ? HierachyTree : dataScanBig,
  };

  spinner.text = "[4/4] Writting result";
  spinner.start();

  try {
    //Create scanDir
    if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir);

    // JSON.stringify(obj, null, 4)
    await writeFilePromise(pathJSON, JSON.stringify(obj));
    spinner.succeed("[4/4] Writting result");

    console.log("Finish".success + " Saved 1 new log file.");
    console.timeEnd("Disk-management-scanner");
  } catch (error) {
    spinner.fail("[4/4] Writting result");

    console.log("Failed".error + " Write file log return with Errror");
    console.timeEnd("Disk-management-scanner");
  }
  process.exit();
});

/**
 * Write file using Promise
 *
 * @param {String} path Path to directory contain file
 * @param {JSON} data Stringtify of Object
 */
async function writeFilePromise(path, data, options = "utf-8") {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, options, function (err) {
      return err ? reject(err) : resolve();
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
    fs.stat(path.join(pathNode, element), function (err, data) {
      return err ? reject(err) : resolve(data);
    });
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
        let node = new Hierachy(
          rootNode,
          path.join(pathNode, element),
          0,
          type
        );
        rootNode.addChild(node);

        if (type == "File") {
          node.addStorage(stats.size);
        }

        if (type == "Directory") {
          await readFromRoot(node, path.join(pathNode, element));
        }
      }
    });
  }
}

/**
 * Find directory has size(storage) >= threshold from rootNode
 *
 * @param {Object} rootNode Root object of Hierachy
 * @param {Number} threshold Threshold wanna filter
 */
async function scanBigDirectory(rootNode, threshold) {
  let tempStroge = 0;

  _.map(rootNode.child, (o) => {
    if (o.type === "File") tempStroge += o.storage;
    else scanBigDirectory(o, threshold);
    return o;
  });

  if (tempStroge > threshold) safe_instance[rootNode.name] = tempStroge;
}

/**
 * Return string like YYYY-MM-DD_HH.MM.SS from Date.now()
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
  _.map(root.child, (o) => {
    o.parent = null;
    if (o.type == "Directory") removeParent(o);
    return o;
  });
}

/**
 * Function scan from root directory
 *
 * @param {String} root Root directory | Default: __dirname
 * @param {Number} threshold Trigger value to show directory with storage > threshold(Bytes) | Default: 1,000,000 Bytes
 *
 */
async function Scan(
  root = __dirname,
  threshold = 1000000,
  mode = ScanType.Normal
) {
  userParam.bigDirectory = threshold;
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
  await readFromRoot(HierachyTree, root);
}

/**
 * Compare two file log
 *
 * @param {Number} threshold Threshold for change folder | Default: 1,000,000 Bytes
 */
async function Compare(threshold = 1000000) {
  spinner.text = "[1/3] Reading result";
  spinner.start();
  let result = fs.readdirSync(scanDir); //Scan all file log in scanDir

  if (result.length < 2) {
    spinner.fail(`[1/3] ${"Failed, too little log file in".error} ${scanDir}`);
    return;
  }
  spinner.succeed("[1/3] Reading result");

  spinner.text = "[2/3] Resolving result";
  spinner.start();
  let path1 = path.join(scanDir, result[result.length - 2]); // older
  let path2 = path.join(scanDir, result[result.length - 1]); // newer

  let data1 = fs.readFileSync(path1, "utf-8");
  let data2 = fs.readFileSync(path2, "utf-8");

  let json1 = JSON.parse(data1).big_directory;
  let json2 = JSON.parse(data2).big_directory;

  let data = _.reduce(
    json2,
    (result, value, key) => {
      if (json1[key]) {
        let change = json1[key] - json2[key];
        if (Math.abs(change) > threshold)
          result.push({ name: key, change: change });
      } else result.push({ name: key, change: value });

      return result;
    },
    []
  );

  spinner.succeed("[2/3] Resolving result");

  if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir);

  let pathJSON = path.join(compareDir, getDateByFormat() + ".log");
  var json = JSON.stringify(data, null, 4);

  spinner.text = "[3/3] Writting result";
  spinner.start();

  await writeFilePromise(pathJSON, json);

  spinner.succeed("[2/3] Resolving result");
  console.log("Done".success + " Saved 1 new log file.");
}

module.exports = {
  ScanType,
  EventType,

  Scan,
  Compare,
};
