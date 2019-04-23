const copyWebpackPlugin = require('copy-webpack-plugin');

const {
  resolve,
  join,
  PUBLIC_PATH,
  ROOT_PATH,
  STATIC_PATH,
  getEntriesWithPolyfill,
} = require('./common');

module.exports = {
  entry: getEntriesWithPolyfill(),
  module: {
    rules: [/* if (preset.typescript) { */
      {
        test: /\.ts$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          'babel-loader?cacheDirectory=true',
          'ts-loader',
        ],
      },/* if (type.anujs) { */
      {
        test: /\.tsx/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          'babel-loader?cacheDirectory=true',
          'ts-loader',
        ],
      },/* } *//* } *//* if (preset.es && type.anujs) { */
      {
        test: /\.jsx$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: 'babel-loader?cacheDirectory=true',
      },/* } */
      {
        test: /\.js$/,/* if (preset['san-store']) { */
        // 在 san-update 库中正常引入的文件是事先编译过的，且打包方式不适合 ie8，这里需要自己再编译一次
        // 在项目中需要以以下方式引入：
        //   import { builder } from 'san-update/index'
        include: /[\\/](src|san-update)[\\/]/,/* } else { */
        include: /[\\/]src[\\/]/,/* } */
        use: 'babel-loader?cacheDirectory=true',
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]?v=[hash:10]',
              outputPath: STATIC_PATH,
            },
          },
        ],
      },
      {
        test: /\.html$/,
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
        ],
      },
    ],
  },
  output: {
    chunkFilename: join(STATIC_PATH, 'js/[name].js?v=[chunkhash:10]'),
    filename: join(STATIC_PATH, 'js/[name].js?v=[hash:10]'),
    path: ROOT_PATH,
    publicPath: PUBLIC_PATH,
  },
  plugins: [
    // copy static files
    new copyWebpackPlugin([
      { from: resolve('../src/static'), to: join(ROOT_PATH, STATIC_PATH) },
    ]),
  ],
  resolve: {
    alias: {
      '@components': resolve('../src/components'),
      '@common': resolve('../src/common'),
      '@utils': resolve('../src/utils'),
      '@': resolve('../src'),/* if (type.anujs) { */
      react: 'anujs/dist/ReactIE.js',
      'react-dom': 'anujs/dist/ReactIE.js',
      'prop-types': 'anujs/lib/ReactPropTypes',
      devtools: 'anujs/lib/devtools',
      'create-react-class': 'anujs/lib/createClass',/* } */
    },
    extensions: [/* if (type.anujs) { */'.tsx', '.jsx',/* } */ '.ts', '.js'],
  },
};
