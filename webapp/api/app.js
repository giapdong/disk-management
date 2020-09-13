const path = require("path");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const ResponseFormat = require("response-format");

const app = express();
if (!process.env.CHECK_POINT)
  require("dotenv-flow").config({
    path: path.join(__dirname, "../enviroments"),
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

  res.json(err);
});

module.exports = app;
