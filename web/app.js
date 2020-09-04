const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const webpack = require("webpack");
const webpackDevMiddleWare = require("webpack-dev-middleware");
const config = require("./webpack.config.js");

const compiler = webpack(config);
const app = express();
if (!process.env.CHECK_POINT)
  require("dotenv-flow").config({ path: __dirname });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//middle ware for webpack
app.use(
  webpackDevMiddleWare(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  })
);

// Router
app.use(require("./router.js"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
