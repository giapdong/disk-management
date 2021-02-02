const disk = require("../index.js");

const executor = async () => {
  let data = await disk.readSystemPartition();
  console.log(data);
  console.log(disk.bytesToSize(20241813504));
};
executor();
