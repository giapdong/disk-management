"use strict";
const lib = require("./build/lib/index");
const interfaces = require("./build/lib/interface/index");

module.exports = { ...lib, ...interfaces };
