const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: __dirname,
  node: {
    __dirname: true,
  },
  mode: "production",
  entry: {
    index: path.join(__dirname, "public/javascripts/main.js"),
    style: path.join(__dirname, "public/stylesheets/style.less"),
  },
  output: {
    path: path.join(__dirname, "public/dist"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/public/dist",
  },
  module: {
    rules: [
      // { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      { test: /\.vue$/, use: ["vue-loader"] },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/public/dist",
              esModule: true,
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/public/dist",
              esModule: true,
            },
          },
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js", // sử dụng 'vue/dist/vue.common.js' nếu là webpack 1
      // vue: "vue/dist/vue.esm.js",
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      ignoreOrder: false,
    }),
    new HtmlWebpackPlugin({
      title: "Disk management",
      template: "index-template.html",
      alwaysWriteToDisk: true,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
