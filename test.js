
const temp = require('./lib/main');
temp.setRootDirectory(__dirname);
temp.setBigStorage(10000);

temp.scanAllWithCompare();
