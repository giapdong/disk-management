const diskConst = require("./lib/const.js");
const diskManagement = require("./lib/index.js");
const partition = require("./lib/partition.js");

module.exports = { ...diskConst, ...diskManagement, ...partition };
