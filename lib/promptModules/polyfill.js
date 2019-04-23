const chalk = require('chalk')

module.exports = cli => {
  const polyfills = exports.polyfills
  const polyfillNames = polyfills.map(o => o.name)
  let maxLength = 0
  for (const name of polyfillNames) {
    if (name.length > maxLength) {
      maxLength = name.length
    }
  }

  cli.injectPrompt({
    name: 'polyfill',
    type: 'checkbox',
    message: 'Please pick the polyfill',
    when: answers => answers.preset === '__manual__',
    choices: polyfills.map(o => ({
      name: `${o.name} ${
        `${' '.repeat(maxLength - o.name.length)}: ${chalk.yellow(`${o.description}`)}`
      }`,
      short: o.name,
      value: o.name,
      checked: true,
    })),
  })

  cli.onPromptComplete((answers, preset) => {
    // with all polyfills as default
    preset.polyfills = answers.polyfill || polyfillNames
  })
}

exports.polyfills = [
  {
    name: 'ie8',
    description: `ie8 dom3 polyfill ${chalk.cyan('https://www.npmjs.com/package/ie8')}`,
  },
  {
    name: 'console-polyfill',
    description: `ie8 console polyfill ${chalk.cyan('https://www.npmjs.com/package/console-polyfill')}`,
  },
  {
    name: 'dom4',
    description: 'ie8 dom4 polyfill, with `ie8` package',
  },
  {
    name: 'fetch-ie8',
    description: `ie8 fetch polyfill ${chalk.cyan('https://www.npmjs.com/package/fetch-ie8')}`,
  },
  {
    name: 'fetch-jsonp-polyfill',
    description: 'support jsonp method in `fetch`',
  },
]
