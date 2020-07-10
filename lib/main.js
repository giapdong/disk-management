const fs = require('fs');
const path = require('path');
const colors = require('colors')
const _ = require('lodash')

colors.setTheme({
    success: 'green',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const resultDir = path.join(__dirname, "..", 'scan')
const compareDir = path.join(__dirname, '..', 'compare')

let root = __dirname;
let Hierachy = null;
/**
 * Là giá trị int tính bằng Byte dung lượng thư mục root
 */
let arrayBigDir = [];

/**
 * Đọc các file/dir có trong thư mục path, thông tin được lưu tại Hierachy.
 * @param rootNode là một object của cây thư mục.
 * @param path Là đường dẫn đến nơi chúng ta đang scan.
 */
async function readFromRoot(rootNode, pathX) {
    let result = fs.readdirSync(pathX) //Scan all item into directory with path pathX

    for (let i = 0; i < result.length; i++) {
        let element = result[i]
        let stats = fs.statSync(path.join(pathX, element));
        let type = stats.isFile() ? 'File' : 'Directory';
        let n = await createObject(rootNode, path.join(pathX, element), 0, type);
        rootNode.addChild(n);

        if (type == 'File') {
            n.addStroge(stats.size);
        }

        if (type == 'Directory') {
            let temp = await readFromRoot(n, path.join(pathX, element));
        }
    }

    return rootNode.storage;
}

function scanBigDirectory(rootNode, threshold) {
    return new Promise(function (resolve, reject) {
        var count = 0;
        const intervalID = setInterval(() => {
            count++;
            if (count === 5) {
                resolve(arrayBigDir);
                //resolve(console.log(`Total storage of ${root} - ${storage.toLocaleString()} Bytes`));
                clearInterval(intervalID);
            }
        }, 200);

        var tempStroge = 0;

        rootNode.child.forEach(element => {
            count = 0;
            if (element.type === 'File') {
                tempStroge += element.storage;
            }
            else scanBigDirectory(element, threshold);
        });
        if (tempStroge > threshold) arrayBigDir.push({ name: rootNode.name, storage: tempStroge })

    })
}


/**---------------------------------------------------//--------------------------------------------------//
|----------------------------------------------------//--------------------------------------------------//
\---------------------------------------------------//--------------------------------------------------*/

/**
 * Tạo ra một Node mới - một Directory | File.
 * @param {Object} parent Là object parent của object hiện tại. Ví dụ: ../
 * @param {String} name Tên của thư mục/File - Địa chỉ tuyệt đối của Directory | File
 * @param {Number} storage Dung lượng của Directory | File tính bằng Bytes
 * @param {String} type Kiểu: Directory | File
 */
async function createObject(parent, name, storage, type) {
    return {
        parent: parent,
        name: name,
        storage: storage,
        type: type,
        child: [],
        addChild: function (child) {
            this.child.push(child);
        },
        addStroge(value) {
            this.storage += value;
            if (this.parent)
                this.parent.addStroge(value);
        },

    }
}
/**
 * Function loại bỏ hết các thuộc tính parent thành null => phục vụ việc convert thành JSON.
 * @param {Object} root Là root object - Hierachy. 
 */
function removeParent(root) {
    root.parent = null;
    // let childLength = root.child.length;
    // for (let i = 0; i < childLength; i++) {
    //     let element = root.child[i];
    //     element.parent = null;
    //     if (element.type == 'Directory') {
    //         let result = await removeParent(element);
    //     }
    // }

    root.child.forEach(element => {
        element.parent = null;
        if (element.type == 'Directory') removeParent(element)
    })
}

/**
 * This is function use process.stdout print with color and format beautiful
 * @param {String} data 
 */
function printScreen(data) {
    let count = 0;
    const intervalID = setInterval(() => {
        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line
        count = (count + 1) % 4;
        var dots = new Array(count + 1).join(".");
        process.stdout.write(data + dots);  // write text
    }, 200);

    function stop() {
        clearInterval(intervalID);
        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line
        process.stdout.write(data + "...\n")
    }

    return { intervalID, stop };
}

/**
 * This is function scan
 * @param {String} root Root directory
 * @param {Number} big Value of big directory wanna show
 */
async function Scan(root = __dirname, big = 1000000) {
    Hierachy = await createObject(null, root, 0, 'Directory');

    let interval = printScreen("[1/4] Scanning")
    let totalStorage = await readFromRoot(Hierachy, root);
    interval.stop();
    console.log(`Total storage: ${totalStorage.toLocaleString()} Bytes`)

    interval = printScreen("[2/4] Scanning big directory")
    let dataScanBig = await scanBigDirectory(Hierachy, big)
    interval.stop();

    interval = printScreen("[3/4] Formatting data")
    removeParent(Hierachy)
    interval.stop();

    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
    let date = ("00" + now.getDate()).slice(-2);
    let hour = ("00" + now.getHours()).slice(-2);
    let minutes = ("00" + now.getMinutes()).slice(-2);
    let second = ("00" + now.getSeconds()).slice(-2);
    let currentDate = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;
    let pathJSON = path.join(resultDir, `${year}-${month}-${date}_${hour}.${minutes}.${second}.log`)


    var obj = { time: currentDate, big_directory: dataScanBig, root: Hierachy };
    // var json = JSON.stringify(obj, null, 4)
    let json = JSON.stringify(obj)

    interval = printScreen("[4/4] Writting result")
    fs.writeFileSync(pathJSON, json, 'utf-8')
    interval.stop();

    console.log("Finish".success + " Saved 1 new log file.");
}
/**
 * Compare two file log 
 * @param {Number} threshold Threshold for change folder
 */
async function Compare(threshold) {
    let interval = printScreen("[1/3] Reading result")
    let result = fs.readdirSync(resultDir) //Scan all file log in resultDir
    interval.stop();

    if (result.length < 3) {
        console.log('Too little file in scan directory')
        return;
    }

    interval = printScreen("[2/3] Resolving result")
    let path1 = path.join(resultDir, result[result.length - 3]);
    let path2 = path.join(resultDir, result[result.length - 2]);

    let data1 = fs.readFileSync(path1, 'utf-8')
    let data2 = fs.readFileSync(path2, 'utf-8')

    let json1 = JSON.parse(data1)
    let json2 = JSON.parse(data2)

    let data = _.reduce(json2.big_directory, (result, value, key) => {
        let item = _.find(json1.big_directory, item => item.name == value.name)
        if (item != null && item.name) {
            let change = value.storage - item.storage;
            if (change > 10)
                result.push({ ...value, storage: change })
        }
        else
            result.push(value)

        return result
    }, [])
    interval.stop();

    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = ("00" + (now.getUTCMonth() + 1)).slice(-2);
    let date = ("00" + now.getDate()).slice(-2);
    let hour = ("00" + now.getHours()).slice(-2);
    let minutes = ("00" + now.getMinutes()).slice(-2);
    let second = ("00" + now.getSeconds()).slice(-2);
    let pathJSON = path.join(compareDir, `${year}-${month}-${date}_${hour}.${minutes}.${second}.log`)

    var json = JSON.stringify(data, null, 4)
    interval = printScreen("[3/3] Writting result")
    fs.writeFileSync(pathJSON, json, 'utf-8')
    interval.stop();
    console.log("Done".success + " Saved 1 new log file.");
}
module.exports = {
    Scan,
    Compare
}