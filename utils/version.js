const pkg = require('../package.json')
const semver = require('semver')
const chalk = require('chalk')

exports.getVersions = () => {
  const result = {
    current: pkg.version,
    latest: '',
  }
  return result
}

exports.checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      `You are using Node ${process.version}, but this version of ${id}` +
      ` requires Node ${wanted}.\nPlease upgrade your Node version.`
    ))
    process.exit(1)
  }
}
