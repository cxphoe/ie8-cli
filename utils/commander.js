const program = require('commander')
const chalk = require('chalk')

exports.enhanceErrorMsg = (methodName, log) => {
  program.Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log('  ' + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}

/**
 * get names of passed command arguments
 *
 * @returns {string[]}
 */
exports.getArgs = command => {
  const result = {}
  command.options
    .map(option => option.long.substring(2))
    .forEach(name => {
      if (command[name] !== undefined) {
        result[name] = command[name]
      }
    })
  return result
}
