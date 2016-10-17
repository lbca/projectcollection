// 文件夹清空组件
//var CleanWebpackPlugin = require('clean-webpack-plugin'),
    // 地址获取组件
var glob = require('glob'),
    url = {
      // js匹配
      jsMatch: __dirname + '/src/js/**/*.main.js',
      // 发布地址
      jsPublic: __dirname + '/src/js/public/'
    },
    // 入口文件列表对象
    entry = getEntry();

/**
 * 获取入口文件列表对象
 * @return {object} 入口文件列表对象
 */
function getEntry() {
  var result = {};

  // 遍历获取地址对象
  glob.sync(url.jsMatch).forEach(function (name) {
      // 去除固定地址部分，注意：正则不加g，代表替换一次结束
      var key = name.replace(/^.*\/src\/js/, '');
      // 去除后缀
      key = key.replace(/^(.*)(\.js)$/, '$1');
      result[key] = name;
  });

  return result;
}

// 配置
module.exports = {
  entry: entry,
  output: {
    path: url.jsPublic,
    filename: "[name].js"
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: "json"
    }, {
      test: /\.js$/,
      // 不需要处理的文件夹
      // exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },
  plugins: [
    //new CleanWebpackPlugin([url.jsPublic], {
    //  //root: '/full/project/path',
    //  // 打印log
    //  verbose: false, 
    //  dry: false,
    //  // 忽略文件
    //  //exclude: ['gao.txt']
    //})
  ]
};

/*{
  entry: __dirname + "/app/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[name]-[hash].js"
  },

  module: {
    loaders: [{
      test: /\.json$/,
      loader: "json"
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
    }]
  },
  postcss: [
    require('autoprefixer')
  ],

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[name]-[hash].css")
  ]
}*/