const readPartation = async () => {
  const { exec } = require("child_process");
  const { stdout, stderr } = await exec("wmic logicaldisk get caption");

  console.log("stdout: ", stdout);
  console.log("stderr: ", stderr);
};

const test = async (req, res) => {
  readPartation();
  return res.json({ message: "Test!" });
};

module.exports = { test };
