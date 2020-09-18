const { readSystemPartition } = require("../../index.js");
const Format = require("response-format");

const test = async (req, res) => {
  console.log("query: ", req.query);
  console.log("body: ", req.body);
  res.json({ message: "Test!", method: req.method });
};

const getSystemPartition = async (req, res) => {
  let data = await readSystemPartition();
  res.json(Format.success("Get info partition success", data));
};

module.exports = { test, getSystemPartition };
