
const disk = require('./lib/main');
const fs = require('fs')

disk.Scan("F:\\Project\\ATV", 100000000)

// disk.Compare();

// let result = fs.readdirSync("F:\\Project") //Scan all item into directory with path pathX

// console.log(result)