const fs = require('fs');
const path = require('path');

var root = __dirname;
var Hierachy = createObject(null,root, 0, 'Directory');
/**
 * Là giá trị int tính bằng Byte dung lượng thư mục root
 */
var storage = 0;
var bigStorage = 1000000000;
var arrayBigDir = [];
/**
 * Đọc các file/dir có trong thư mục path, thông tin được lưu tại Hierachy.
 * @param rootNode là một object của cây thư mục.
 * @param path Là đường dẫn đến nơi chúng ta đang scan.
 */
function readFromRoot(rootNode, pathX) {
    return new Promise(function(resolve, reject){
      var count = 0;
      const intervalID = setInterval(() => {
        count++;
        if(count === 5){
           
            resolve(storage);
            //resolve(console.log(`Total storage of ${root} - ${storage.toLocaleString()} Bytes`));
            clearInterval(intervalID);
        }
      }, 200);
      fs.readdir(pathX, (err, data) => {
        if (err) console.log(`Read dir failed with status: ${err}`);
        data.forEach(element => {
            //var pathf = pathX + '/' + element;
            var pathf = path.join(pathX, element);
            fs.stat(pathf, function(err, stats) {
                if (err) return console.log(`Error while read status at ${pathf}`);
                var type = stats.isFile() ? 'File' : 'Directory';

                var n = createObject(rootNode,pathf, 0, type);
                rootNode.addChild(n);

                if (type == 'File') {
                    storage += stats.size;
                    n.addStroge(stats.size);
                }

                if (type == 'Directory') {
                    readFromRoot(n, pathf);
                }
                counter = 0;
                count = 0;
            });
        });
    });
    })
}

function scanBigDirectory(rootNode) {
    return new Promise(function(resolve, reject){
        var count = 0;
        const intervalID = setInterval(() => {
          count++;
          if(count === 5){
              resolve(arrayBigDir);
              //resolve(console.log(`Total storage of ${root} - ${storage.toLocaleString()} Bytes`));
              clearInterval(intervalID);
          }
        }, 200);

        var tempStroge = 0;

        rootNode.child.forEach(element =>{
            count = 0;
            if(element.type === 'File'){
                tempStroge += element.storage;
            }
            else scanBigDirectory(element);
        });
        if (tempStroge > bigStorage) arrayBigDir.push({name: rootNode.name, storage: tempStroge})
        
    })
}


//---------------------------------------------------//--------------------------------------------------//
/**
 * Tạo ra một Node mới - một Directory | File.
 * @param {Number} parent Là object parent của object hiện tại. giống ..
 * @param {*} name Tên của thư mục/File - là địa chỉ tuyệt đối.
 * @param {*} storage Dung lượng của thư mục / file tính bằng Byte.
 * @param {*} type Kiểu: Directory | File
 */
function createObject(parent,name, storage, type){
    return {
        parent: parent,
        name: name, 
        storage: storage, 
        type: type, 
        child: [],
        addChild: function(child){
            this.child.push(child);
        },
        addStroge(value){
            this.storage += value;
            if(this.parent)
            this.parent.addStroge(value);
        },

    }
}
/**
 * Function loại bỏ hết các thuộc tính parent thành null => phục vụ việc convert thành JSON.
 * @param {Object} root Là root object - Hierachy. 
 */
function removeParent(root){
    root.parent = null;
    root.child.forEach(element => {
        element.parent = null;
        if(element.type == 'Directory') removeParent(element);
    });
}

module.exports = {
    readFromRoot(){
        console.log(`========> Start scan your memory <========`);
        return readFromRoot(Hierachy, root);
    },
    setRootDirectory(rootDir){
        root = rootDir;
    },
    setBigStorage(value){
        bigStorage = value;
    },
    scanBigDirectory(){
        console.log(`========> Start scan all big directory <========`)
        return scanBigDirectory(Hierachy);
    },
    scanAll(){
        console.log("=========> Start scan memory <==================")
        readFromRoot(Hierachy, root)
        .then((data)=>{
        console.log(`Total storage: ${data.toLocaleString()} Bytes`)
        console.log("=========> Start scan big directory <===========");
        return scanBigDirectory(Hierachy)
        })
        .then(function(data){
            console.log(data);
            console.log("=========> Start write file <==================");
            removeParent(Hierachy)
            var pathJSON = './result/' + Date.now();
            var obj = {root: Hierachy, array: data};
            var json = JSON.stringify(obj, null, 4)
            fs.writeFile(pathJSON, json, 'utf-8', function(){console.log("Done write file")})
        })
        .then(()=>console.log('Finish'));
    },
    scanAllWithCompare(){
        console.log("=========> Start scan memory <==================")
        readFromRoot(Hierachy, root)
        .then((data)=>{
            console.log(`Total storage: ${data.toLocaleString()} Bytes`)
            console.log("=========> Start scan big directory <===========");
            return scanBigDirectory(Hierachy)
        })
        .then(function(data){
            return new Promise(function(resolve, reject){
                console.log(data);
                console.log("=========> Start write file <==================");
                removeParent(Hierachy)
                var pathJSON = `./result/${Date.now()}`;
                var obj = {root: Hierachy, array: data};
                var json = JSON.stringify(obj, null, 4)
                fs.writeFile(pathJSON, json, 'utf-8', function(){
                    console.log(`Write new status at: ${pathJSON}`)
                    resolve();
                })
            })
        })
        .then(function(){
            console.log(`========> Start compare all dir <=============`)
            
        });
    }
}