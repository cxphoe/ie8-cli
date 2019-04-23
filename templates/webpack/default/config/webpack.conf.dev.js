const merge = require('webpack-merge');
const htmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHotPlugin = require('html-webpack-hot-plugin');
const defaultConfig = require('./webpack.conf.js');

const {
  resolve,
  ROOT_PATH,
} = require('./common');

const entries = Object.keys(defaultConfig.entry);
const htmlHotPlugin = new HtmlWebpackHotPlugin();

module.exports = merge(defaultConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: /[\\/]src[\\/]/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
              removeComments: true,
              minifyJS: true,
              minifyCSS: true,
            },
          },
          'pug-plain-loader',
        ],
      },/* if (preset.cssPreProcessor === 'scss') { */
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },/* } else if (preset.cssPreProcessor === 'less') { */
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },/* } */
    ],
  },
  plugins: [
    ...entries.map(
      (entry) => new htmlWebpackPlugin({
        chunks: [entry],
        filename: `${entry}.html`,
        template: resolve(`../src/view/${entry}/index.pug`),
      })
    ),
    htmlHotPlugin,
  ],
  devServer: {
    contentBase: ROOT_PATH,
    host: '127.0.0.1',
    compress: true,
    port: 8000,
    open: true,
    openPage: `${entries[0]}.html`,
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
    before(app, server) {
      htmlHotPlugin.setDevServer(server);
    },
  },
});
