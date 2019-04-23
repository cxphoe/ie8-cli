const fs = require('fs-extra')
const chalk = require('chalk')

const spinner = require('../../utils/spinner')
const logger = require('../../utils/logger')
const constant = require('./constant')

class DirectoryOperator {
  constructor(creator) {
    this.creator = creator
    this.actions = Object.values(constant.dirAction)
  }

  async [constant.dirAction.OVERWRITE]() {
    const { targetDir } = this.creator
    logger.log()
    spinner.logWithSpinner(`Removing ${chalk.cyan(targetDir)}...\n`)
    await fs.remove(targetDir)
    spinner.stopSpinner()
  }

  async [constant.dirAction.MERGE]() {
    const { generator, options } = this.creator
    const { exclude: excludedFiles } = options
    if (excludedFiles) {
      logger.log()
      logger.log('Files below will not be covered if exist:')
      for (const file of excludedFiles) {
        logger.log(`    ${chalk.cyan(file)}`)
      }
      logger.log()

      generator.addExcludedFiles(
        ...excludedFiles
      )
    }
  }

  [constant.dirAction.CANCEL]() {
    process.exit(1)
  }
}

module.exports = DirectoryOperator
