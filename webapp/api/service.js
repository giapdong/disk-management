const readPartation = async () => {
  const { exec } = require("child_process");
  const { stdout, stderr } = await exec("wmic logicaldisk get caption");

  console.log("stdout: ", stdout);
  console.log("stderr: ", stderr);
};

const readOS = async () => {
  const os = require("os");
  console.log(os.platform());
  console.log(os.release());
  console.log(os);
};

const test = async (req, res) => {
  // readPartation();
  readOS();
  return res.json({ message: "Test!" });
};

module.exports = { test };
