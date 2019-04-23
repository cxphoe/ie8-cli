#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const chalk = require('chalk')
const program = require('commander')
const pkg = require('../package.json')
const {
  checkNodeVersion,
} = require('../utils/version')
const {
  enhanceErrorMsg,
  getArgs,
} = require('../utils/commander')
const {
  execSync,
} = require('child_process')

const hasYarn = require('../utils/env').hasYarn()

checkNodeVersion(pkg.engines.node, pkg.name)


// register command of version
program
  .version(pkg.version, '-v, --version')
  .usage('<command> [options]')


// register command <create>
program
  .command('create <app-name>')
  .description('create a new project powered by ie8-cli')
  .option('--type <value>', 'Boilerplate type, default to `es`')
  .option('-d, --default', 'Skip prompts and use default preset')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-i, --install', 'Install dependencies after creating project')
  .option('--exclude <items>', 'Exclude files in target directory that you do not wanna cover while merging', val => val.split(','))
  .action((name, cmd) => {
    require('../lib/create')(name, getArgs(cmd))
      .catch(error => {
        console.trace(error)
        process.exit(1)
      })
  })


// update self
program
  .command('update')
  .description('update from remote source')
  .action(() => {
    console.log(__dirname)
    const ssh = pkg.config.ssh
    const clause = (hasYarn
      ? 'yarn global add'
      : 'npm install -g') + ` ie8-cli@git+ssh://${ssh}`
    execSync(clause, {
      encoding: 'utf-8',
      stdio: [0, 1, 2],
    })
  })


// output help information on unknown commands
program
  .arguments('<command>')
  .action(cmd => {
    program.outputHelp()
    console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })


// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan('san <command> --help')} for detailed usage of given command.`)
  console.log()
})


enhanceErrorMsg('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMsg('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMsg('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
    flag ? `, got ${chalk.yellow(flag)}` : ''
  )
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
