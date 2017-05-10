var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var glob = require('glob');

var APP_ENV = 'dev';
if (process.env.APP_ENV) APP_ENV = process.env.APP_ENV;

var publicPath = '/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var webpackConfig = {
  devtool: 'eval',
  entry: {
    vendor: ['webpack/hot/dev-server', hotMiddlewareScript],// 额外插件打包成vender
    index: './js/pages/index.js',
  },
  output: {
    path: path.join(ROOT_PATH, 'dist'),
    publicPath: publicPath, // output.path的相对路径
    filename: 'js/[name].js' // 根据原始名动态命名
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'js/pages')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
      }, {
        test: /\.scss$/,
        loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
      }]
  },
  plugins: [
    //这个插件不能少,生成一份虚拟的html文件放到webpack-dev-server中,否则会报错404
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      '__APP_ENV__': JSON.stringify(APP_ENV),
    }),
  ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
  var files = glob.sync(globPath),
    entries = {};
  files.forEach(function (filepath) {
    // 取倒数第二层(view下面的文件夹)做包名
    var split = filepath.split('/');
    var name = split[split.length - 1];

    entries[name] = [filepath];
  });

  return entries;
}

var entries = getEntries('./js/pages/*.js');

Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
  webpackConfig.entry[name] = entries[name];
});

module.exports = webpackConfig;