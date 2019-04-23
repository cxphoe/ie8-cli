const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const defaultConfig = require('./webpack.conf.js');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const es3ifyPlugin = require('es3ify-webpack-plugin-v2');
const { isCopiedJsFile } = require('./utils');

const {
  resolve,
  join,
  STATIC_PATH,
  TEMPLATE_PATH,
  ROOT_PATH,
  POLIFILL_LIST,
} = require('./common');

const recursiveIssuer = function (m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  }
  return false;
};

/**
 * @param {string} name
 * @returns {import('html-webpack-plugin').Options}
 */
const getPugConf = (name) => ({
  chunks: [name, 'polyfill', 'common', 'vendors'],
  filename: join(TEMPLATE_PATH, `${name}.pug`),
  template: resolve(`../src/view/${name}/index.pug`),
  minify: {
    removeComments: true,
    collapseWhitespace: false,
  },
});

module.exports = merge(defaultConfig, {
  mode: 'production',
  devtool: '#source-map',
  optimization: {
    minimizer: [
      new UglifyjsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
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
      // The number of chunks that an entry file can accept
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
  module: {
    rules: [/* if (preset.cssPreProcessor === 'less') { */
      {
        test: /\.less$/,
        include: /[\\/]src[\\/]/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },/* } */
      {
        test: /\.pug$/,
        include: /[\\/]view[\\/]/,
        use: 'pug-package-loader',
      },
      {
        test: /\.pug/,
        include: /[\\/]src[\\/]/,
        exclude: /[\\/]view[\\/]/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              attrs: ['img:src'],
            },
          },
          'pug-plain-loader',
        ],
      },
    ],
  },
  plugins: [
    // erase packaged files
    new CleanWebpackPlugin([STATIC_PATH, TEMPLATE_PATH], {
      dry: false,
      // exclude: [ 'shared.js' ],
      root: ROOT_PATH,
      verbose: true,
    }),
    new es3ifyPlugin({
      test: {
        test(filepath) {
          return /\.js$/.test(filepath) && !isCopiedJsFile(filepath);
        },
      },
    }),
    // get templates of all entries
    ...Object.keys(defaultConfig.entry).map((entry) => new HtmlWebpackPlugin(getPugConf(entry))),
    // enable introducing packaged source path in pug template
    new HtmlWebpackPugPlugin(),
    // extract css
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: join(STATIC_PATH, 'css/[name].css?v=[hash:10]'),
      chunkFilename: join(STATIC_PATH, 'css/[name].css?v=[hash:10]'),
    }),
    // optimize css files
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
  ],
});
