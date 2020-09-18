exports.readPartition = async () => {
  return new Promise(async (resolve, reject) => {
    const { exec } = require("child_process");
    const { stdout } = await exec(
      "wmic logicaldisk get deviceid, freespace, size"
    );

    stdout.on("data", (data) => {
      let listPartition = data.split("\r\r\n").filter((item) => item);
      listPartition = listPartition.map((item) => item.trim().split(/\s+/gm));
      let first = listPartition.shift();
      first = first.map((item) => item.toLowerCase());

      listPartition = listPartition.map((item) => {
        return Object.fromEntries(
          item.map((value, index, origin) => {
            return [first[index], value];
          })
        );
      });
      resolve(listPartition);
    });
  });
};
