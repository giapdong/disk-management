
const disk = require('./lib/main');
const fs = require('fs');
const path = require('path')
const colors = require('colors')
const Events = require('events')

colors.setTheme({
    success: 'green',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

disk.Scan("F:\\Project\\eco4p", 10000)
// disk.ScanAndFilter("F:\\ProgramData", 10000)
// disk.Scan(__dirname, 10000)

// disk.Compare();