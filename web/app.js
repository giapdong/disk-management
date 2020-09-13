const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const ResponseFormat = require("response-format");

const app = express();
if (!process.env.CHECK_POINT)
  require("dotenv-flow").config({ path: path.join(__dirname, "enviroments") });

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
      index: "public/dist/index.html",
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// Router
app.use(require("./router.js"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(ResponseFormat.notFound("Not found!", null));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);

  res.json(ResponseFormat.internalError());
});

module.exports = app;
