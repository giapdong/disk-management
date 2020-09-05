// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require("html-webpack-plugin");

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      console.log("The compiler is starting a new compilation...");

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        "MyPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.html += "The Magic Footer";
          console.log(data.toString());
          // Tell webpack to move on
          cb(null, data);
        }
      );
    });
  }
}

module.exports = MyPlugin;
