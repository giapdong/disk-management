const diskConst = require("./lib/const.js");
const partition = require("./lib/partition.js");
const diskManagement = require("./lib/index.js");

module.exports = { ...diskConst, ...diskManagement, ...partition };
