const path = require("path");
const morgan = require("morgan");
const express = require("express");

const app = express();
if (!process.env.CHECK_POINT) {
  let pathENV = path.join(__dirname, "../enviroments");
  require("dotenv-flow").config({ path: pathENV });
}

if (process.env.NODE_ENV == "development") {
  const webpack = require("webpack");
  const config = require("./webpack.dev.js");
  const compiler = webpack(config);
  const webpackDevMiddleWare = require("webpack-dev-middleware");

  //middle ware for webpack
  app.use(
    webpackDevMiddleWare(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
        chunks: false,
      },
      index: "dist/index.html",
    })
  );
  // Attach the hot middleware to the compiler & the server
  app.use(
    require("webpack-hot-middleware")(compiler, {
      log: console.log,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000,
    })
  );
}

app.use(morgan("dev"));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

module.exports = app;
