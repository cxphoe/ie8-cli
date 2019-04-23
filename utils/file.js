const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const logger = require('./logger')

/**
 * get file paths of an existed directory
 *
 * @param {string | string[]} basePath path of a directory where you wanna get file paths from
 * @param {object} options
 * @param {string[]} [options.relativePaths] paths of the files(directory or exact file path), if empty will return the path of all files in basepath
 * @param {boolean} [options.warn] warn in console when occurs to error
 * @return {Promise<string[]>}
 */
exports.getFilePaths = async (basePath, {
  relativePaths,
  warn = false,
} = {}) => {
  if (basePath instanceof Array) {
    return [].concat(...basePath.map(bp => exports.getFilePaths(bp, {
      relativePaths,
      warn,
    })))
  }

  let result = []
  if (!relativePaths) {
    relativePaths = fs.readdirSync(basePath)
  }
  for (const p of relativePaths) {
    const filePath = path.join(basePath, p)
    const fileExist = await fs.pathExists(filePath)

    if (!fileExist) {
      warn && logger.warn(`file ${chalk.cyan(filePath)} does not exist!`)
      continue
    }
    if (fs.statSync(filePath).isDirectory()) {
      result = [
        ...result,
        ...await exports.getFilePaths(filePath, {
          warn,
        }),
      ]
    } else {
      result.push(filePath)
    }
  }
  return result
}
