module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        // debug: true,
        useBuiltIns: 'usage',
        // forceAllTransforms: true,
        targets: {
          browsers: [
            'ie >= 8',
            'chrome >= 62',
          ],
        },
      },
    ],/* if (type.anujs) { */
    [
      '@babel/preset-react',
    ],/* } */
  ],
  plugins: [
    // This plugin transforms static class properties as well as properties declared with the property initializer syntax
    [
      '@babel/plugin-proposal-class-properties',
    ],
    // for import()
    [
      '@babel/plugin-syntax-dynamic-import',
    ],
    // 用于转换 export default
    [
      'transform-es2015-modules-commonjs',
      {
        loose: true,
      },
    ],
  ],
};
