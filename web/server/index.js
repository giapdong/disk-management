const express = require("express");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const open = require("open");
const webpackConfig = require("../../webpack.config.js");
const app = express();
if (!process.env.PORT) require("dotenv-flow").config({ path: "web/" });

// Router
app.use(require("./router.js"));

// Run
const port = process.env.PORT || 10203;
app.listen(process.env.PORT || 10203, async () => {
  console.log("Server is running at " + port);
  await open(path.join("..", "client", "index.html"));
});
