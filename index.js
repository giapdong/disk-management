const diskConst = require("./lib/const.js");
const diskManagement = require("./lib/index.js");

module.exports = { ...diskConst, ...diskManagement };
