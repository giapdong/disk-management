const os = require("os");
const win32 = require("./os/win32.js");

exports.readSystemPartition = async () => {
  return new Promise(async (resolve, reject) => {
    switch (os.platform()) {
      case "win32": {
        let data = await win32.readPartition();
        resolve(data);
        break;
      }
      default:
        resolve(null);
        break;
    }
  });
};
