const chalk = require('chalk')

const optionAlternatives = {
  type: ['san', 'anujs', 'default'],
}

const defaults = {
  type: 'default',
}

module.exports = class CreatorOptions {
  constructor(raw) {
    this.options = {
      ...defaults,
      ...raw,
    }
    this.checkOptions(this.options)
  }

  checkOptions() {
    for (const key of Object.keys(optionAlternatives)) {
      const alternatives = optionAlternatives[key]
      const optionValue = this.options[key]
      if (optionValue && !alternatives.includes(optionValue)) {
        throw new Error('Invalid option value' + chalk.yellow(` \`${
          optionValue
        }\` `) + `for option ${
          chalk.cyan(key)
        }. Expected ${
          alternatives.map(n => chalk.yellow(`\`${n}\``)).join(', ')
        } or empty string`)
      }
    }
  }

  /**
   * get option value
   * @param {string} optionName name of option
   * @param {any} defaultValue this value will return if options[optionName] is undefined
   * @returns {any}
   */
  get(optionName, defaultValue)  {
    let val = this.options[optionName]
    if (val === undefined) {
      val = defaultValue
    }
    return val
  }
}
