const chalk = require('chalk')

module.exports = cli => {
  cli.injectFeature({
    name: 'cssPreProcessor',
    checked: true,
    disabled: chalk.green('with LESS as default'),
  })

  cli.onPromptComplete((answers, preset) => {
    preset.cssPreProcessor = 'less'
  })
}
