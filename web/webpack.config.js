const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
if (!process.env.CHECK_POINT)
  require("dotenv-flow").config({ path: __dirname });

module.exports = {
  context: __dirname,
  node: {
    __dirname: true,
  },
  mode: process.env.NODE_ENV || "development",
  entry: {
    index: path.join(__dirname, "public/javascripts/main.js"),
  },
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/public/dist",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
      { test: /\.vue$/, use: ["vue-loader"] },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
      {
        test: /\.less$/,
        use: ["vue-style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js", // sử dụng 'vue/dist/vue.common.js' nếu là webpack 1
      vue: "vue/dist/vue.esm.js",
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devtool: "inline-source-map",
};
