module.exports = cli => {
  const m = exports.module

  cli.injectFeature(m)

  cli.onPromptComplete((answers, preset) => {
    if (answers.features.includes(m.value)) {
      preset[m.value] = true
    }
  })
}

exports.module = {
  name: 'eslint',
  value: 'eslint',
  short: 'eslint',
  checked: true,
}
