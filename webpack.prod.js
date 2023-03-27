const path = require('path');
const fs = require('fs');
const semver = require('semver');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BeforeRunWebpackPlugin = require('@panhezeng/before-run-webpack-plugin');
let pkg = require('./package.json');

function modify(buffer) {
  const today = new Date();
  const now = new Date();
  // 获取当年1月1日的时间
const yearStart = new Date(now.getFullYear(), 0, 1);
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // month从0开始计数，所以需要+1
const hms = `${today.getHours().toString().padStart(2, '0')}${today.getMinutes().toString().padStart(2, '0')}.${today.getSeconds().toString().padStart(2, '0')}`;
const day = today.getDate().toString().padStart(2, '0');
const dateStr = `${year}${month}${day}`;
// 计算从当年1月1日到当天的毫秒数
const milliseconds = now.getTime() - yearStart.getTime();

// 将毫秒数转换成天数并向下取整
const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));

// 获取当天零点的时间
const today1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// 计算当天所经历的秒数
const uniqueId  = Math.floor((now.getTime() - today1.getTime()) / 1000);

  // copy-webpack-plugin passes a buffer
  var manifest = JSON.parse(buffer.toString());

  // make any modifications you like, such as
  // manifest.version = pkg.version +'.'+ ~~((Date.now()-1670000000000)/1000);
  manifest.version = `${pkg.version}.${days}.${hms}`;
  

  // pretty print to JSON with two spaces
  manifest_JSON = JSON.stringify(manifest, null, 2);
  return manifest_JSON;
}

function updateVersion() {
  const manifestPath = path.join(__dirname, 'src', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.version = semver.inc(manifest.version, 'patch');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

module.exports = {
  mode:"production",
  entry: {
    script: path.resolve(__dirname, 'src/script.js'),
    background: path.resolve(__dirname, 'src/background.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', 
        // transform (content, path) {
        //   return modify(content)
        // },
        to: 'manifest.json' },
        { from: 'public/images', to: 'images' }
      ]
    }),
    new BeforeRunWebpackPlugin({
      cb: function() {
        console.log("before run");
        updateVersion();
      }
    })
  ]
};
