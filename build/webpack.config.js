const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isDev = process.env.NODE_ENV === 'development'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const commonConfig = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: {
    app: resolve('src/main.js')
  },
  output: {
    path: resolve('output'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[id].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "chrome": "67"
                  },
                  "useBuiltIns": "usage",
                  "corejs": 2,
                }
              ]
            ],
            "plugins": [
              "@babel/plugin-syntax-dynamic-import",
              [
                "@babel/plugin-transform-runtime",
                {
                  "corejs": 2,
                  "helpers": true,
                  "regenerator": true,
                  "useESModules": false
                }
              ]
            ]
          },
        },
        exclude: file => /node_modules/.test(file),
        include: file => /src/.test(file)
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({
      template: resolve('index.html'),
    }),
    new BundleAnalyzerPlugin()
  ]
}

const devConfig = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8007,
    headers: {
      'Access-Control-Allow-Origins': '*'
    },
    overlay: {
      errors: true
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    useLocalIp: true
  },
  optimization: {
    usedExports: true
  }
}

const prodConfig = {
  devtool: 'cheap-module-source-map',
  optimization: {
    // SplitChunksPlugin config
    // 如下是官方默认配置
    splitChunks: {
      // async 只对异步代码生效
      // all 对同步异步都做代码分割, 但是同步代码还需cacheGrops配置
      // initial 只对同步代码做分割
      chunks: 'async',
      // 如果引入的模块大于minSize才做代码分割
      minSize: 30000,
      // 对于大于maxsize的模块尝试进行二次代码分割
      maxSize: 0,
      // 打包后的文件至少有多少个chunk文件引入这个模块才进行代码分割
      minChunks: 1,
      // 同时加载的模块数量, 
      // 在打包前5个库的时候会生成5个js文件,
      // 超过5个就不再做代码分割
      maxAsyncRequests: 5,
      // 入口文件做代码分割的最大文件数量
      maxInitialRequests: 3,
      // 自动命名定界符
      automaticNameDelimiter: '~',
      // 让cacheGroups里的filename生效
      name: true,
      // 缓存组, 把库文件先放到缓存里, 再根据test规则分组合并打包
      cacheGroups: {
        // vendors: false
        vendors: {
          // 如果是node_modules里面的文件, 就打包到vendors组里
          test: /[\\/]node_modules[\\/]/,
          // 分组时的优先级
          priority: -10
          // // 组文件的名字 vendors.js, 不然会是 vendors~main.js
          // filename: 'vendors.js' 
        },
        // 被分割的代码的默认的配置, 没有test, 所有模块都符合要求
        default: {
          // 至少被引用了2次
          minChunks: 2,
          priority: -20,
          // 复用已被分割打包过了的模块
          reuseExistingChunk: true,
          // // 组的文件名
          // filename: 'common.js',
        }
      }
    }
  }
}

module.exports = merge(commonConfig, isDev ? devConfig : prodConfig)

