const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const devConfig = require('./webpack.conf.dev');
const es3ifyPlugin = require('es3ify-webpack-plugin-v2');
const { isCopiedJsFile } = require('./utils');
const copyWebpackPlugin = require('copy-webpack-plugin');

const {
  join,
  resolve,
  POLIFILL_LIST,
  ROOT_PATH,
  STATIC_PATH,
} = require('./common');

const recursiveIssuer = function (m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  }
  return false;
};

const defaultConfig = {
  ...devConfig,
  mode: 'production',
  devtool: undefined,
  plugins: [
    // 复制静态内容
    new copyWebpackPlugin([
      { from: resolve('../src/static'), to: join(ROOT_PATH, STATIC_PATH) },
    ]),
    // 将以关键字命名的变量用引号包起来
    new es3ifyPlugin({
      test: {
        test(filepath) {
          return /\.js$/.test(filepath) && !isCopiedJsFile(filepath);
        },
      },
    }),
    ...Object.keys(devConfig.entry).map((name) => new HtmlWebpackPlugin({
      chunks: [name, 'polyfill', 'common', 'vendors'],
      filename: `${name}.html`,
      template: resolve(`../src/view/${name}/index.pug`),
    })),
  ],
};

module.exports = merge(defaultConfig, {
  performance: {
    hints: false,
  },
  optimization: {
    minimizer: [
      new UglifyjsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          ie8: true,
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 3000,
      minChunks: 1,
      maxAsyncRequests: 5,
      // 一个入口文件能接受的 chunks 个数
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        polyfill: {
          name: 'polyfill',
          test: new RegExp(`[\\\\/]node_modules[\\\\/](${POLIFILL_LIST.join('|')})[\\\\/]`),
          priority: 0,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        commons: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
