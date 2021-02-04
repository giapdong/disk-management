class MyPlugin {
  apply(compiler) {
    const namePlugin = "MyPlugin";

    compiler.hooks.done.tap(namePlugin, (stats) => {
      console.log("Compiler process done.");
    });

    compiler.hooks.beforeCompile.tapAsync(namePlugin, (params, callback) => {
      console.log("Webpack compiling module");
      callback();
    });
  }
}

module.exports = MyPlugin;
