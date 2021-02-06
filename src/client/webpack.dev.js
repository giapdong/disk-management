const path = require("path");
const webpack = require("webpack");
const MyPlugin = require("./src/plugin/index.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const hotMiddlewareScript =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";
if (!process.env.CHECK_POINT)
  require("dotenv-flow").config({ path: path.join(__dirname, "enviroments") });

module.exports = {
  context: __dirname,
  node: {
    __dirname: true,
  },
  devtool: "inline-source-map",
  mode: "development",
  entry: {
    index: [
      path.join(__dirname, "src/javascripts/main.js"),
      hotMiddlewareScript,
    ],
    style: [
      path.join(__dirname, "src/stylesheets/style.less"),
      hotMiddlewareScript,
    ],
    icon: path.join(__dirname, "src/images/icon.svg"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    // publicPath: `${process.env.BASE_CLIENT_URL}:${process.env.PORT}/public/dist`,
    publicPath: "/dist",
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
              esModule: true,
              hmr: true,
              reloadAll: true,
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
              esModule: true,
              hmr: true,
              reloadAll: true,
            },
          },
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              publicPath: "images/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js", // sử dụng 'vue/dist/vue.common.js' nếu là webpack 1
      // vue: "vue/dist/vue.esm.js",
      mixin: path.resolve(__dirname, "src/stylesheets/mixin.less"),
      "@": __dirname,
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, "dist"),
    }),
    new MyPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
