module.exports = (cli, options) => {
  if (options.get('type') !== 'san') {
    return
  }

  const m = exports.module

  cli.injectFeature(m)

  cli.onPromptComplete((answers, preset) => {
    if (answers.features.includes(m.value)) {
      preset[m.value] = true
    }
  })
}

exports.module = {
  name: 'san-store',
  value: 'san-store',
  short: 'san-store',
  checked: true,
}
