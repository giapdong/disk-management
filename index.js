const diskConst = require("./src/lib/const.js");
const partition = require("./src/lib/partition.js");
const diskManagement = require("./src/lib/index.js");

module.exports = { ...diskConst, ...diskManagement, ...partition };
