const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  node: {
    __dirname: true,
  },
  mode: process.env.NODE_ENV || "development",
  entry: {
    index: path.join(__dirname, "client", "main.js"),
  },
  output: {
    path: path.join(__dirname, "__build__"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/__build__/",
  },
  devServer: {
    contentBase: path.join(__dirname, "client"), // static file
    compress: true,
    open: true,
    port: 10203,
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
