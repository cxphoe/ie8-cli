const regexpSpecialChars = new Set('\\/*()[]{}^$')

/**
 * 格式化作为正则表达式模板的字符串，将特殊字符做转义处理
 *
 * @param {string} pattern
 */
exports.regexpFormat = pattern => {
  const result = pattern.split('')
    .map(char => {
      if (regexpSpecialChars.has(char)) {
        return '\\' + char
      }
      return char
    })
    .join('')
  return result
}
