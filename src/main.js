const beauty = require('js-beautify').js_beautify;
const fs = require('fs');
const path = require('path');

function HelloCompilationPlugin(options) {
  this.options = options;
}

HelloCompilationPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const options = this.options;
    let config = '';
    try {
      config = require(options.path);
    } catch (error) {
      console.error('webpack-project-config错误警告 => 请检查path路径是否正确');
      return;
    };
    const code = beauty(
      JSON.stringify(config[options.pattern]), {
      indent_size: 2
    });
    // 格式化
    const configCode = `export default ${code}`;
    const filePath = path.resolve(__dirname, options.output);
    // 写入文件
    fs.writeFile(filePath, configCode, (error) => {
      if (error) {
        console.error('webpack-project-config错误警告 => 配置文件写入失败');
        console.error(error);
      } else {
        callback();
      };
    });
  });
};

module.exports = HelloCompilationPlugin;