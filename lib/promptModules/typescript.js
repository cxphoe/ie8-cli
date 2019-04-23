module.exports = cli => {
  const m = exports.module

  cli.injectFeature(m)

  cli.onPromptComplete((answers, preset) => {
    if (answers.features.includes(m.value)) {
      preset[m.value] = true
    } else {
      preset.es = true
    }
  })
}

exports.module = {
  name: 'typescript',
  value: 'typescript',
  short: 'typescript',
  checked: true,
}
