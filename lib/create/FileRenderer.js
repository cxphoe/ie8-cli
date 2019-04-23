const ejs = require('ejs')
const fs = require('fs-extra')
const chalk = require('chalk')

const logger = require('../../utils/logger')
const { regexpFormat } = require('../../utils/format')

module.exports = class FileRenderer {
  /**
   * 文件内容渲染器，可根据预设的分隔符，将分隔符中的内容进行渲染
   *
   * TODO
   * 目前模板固定假设为 ejs，后期可能需要做一层转化
   *
   * @param {{prefix: string, suffix: string}} delimiters 渲染内容的分隔符
   */
  constructor(delimiters) {
    this.delimiters = {
      // delimiters in the file content
      file: null,
      // delimiters of the used viewEngine
      viewEngine: {
        prefix: '<%',
        suffix: '%>',
      },
    }
    if (delimiters) {
      this.delimiters.file = {
        prefix: regexpFormat(delimiters.prefix),
        suffix: regexpFormat(delimiters.suffix),
      }
    }
  }

  replaceDelimiters(content) {
    const {
      file: {
        prefix: filePrefix,
        suffix: fileSuffix,
      },
      viewEngine: {
        prefix: viewEnginePrefix,
        suffix: viewEngineSuffix,
      },
    } = this.delimiters

    const pattern = new RegExp(
      `${filePrefix}([^${filePrefix}]*)${fileSuffix}`,
      'g',
    )
    const replacement = `${viewEnginePrefix}$1${viewEngineSuffix}`
    return content.replace(pattern, replacement)
  }

  async renderFile(filepath, locals) {
    let fileContent = await fs.readFileSync(filepath, {
      encoding: 'utf-8',
    })
    // if delimiters of files exists, then replace them
    // with delimiters of viewEngine for later rendering
    if (this.delimiters.file) {
      fileContent = this.replaceDelimiters(fileContent)
    }
    // fs.writeFileSync(filepath, fileContent)
    const renderResult = ejs.render(fileContent, locals)
    fs.writeFileSync(filepath, renderResult)
  }

  async render(files, metadata) {
    // ensure the parameters needed for rendering exist
    const locals = {
      preset: {},
      info: {},
      ...metadata,
    }
    for (const filepath of files) {
      try {
        await this.renderFile(filepath, locals)
      } catch (error) {
        logger.error(`Failed during rendering! File: ${chalk.cyan(filepath)}`)
        console.trace(error)
        process.exit(1)
      }
    }
  }
}
