const chalk = require('chalk')
const inquirer = require('inquirer')
const EventEmitter = require('events')
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const assert = require('assert')

const useYarn = require('../../utils/env').hasYarn()
const spinner = require('../../utils/spinner')
const logger = require('../../utils/logger')
const Generator = require('./Generator')
const DirectoryOperator = require('./DirectoryOperator')
const constant = require('./constant')
const CreatorOptions = require('./Options')

const requiredInfoFields = {
  package: ['name', 'version', 'description', 'author', 'license'],
  readme: ['name', 'description'],
}

class Creator extends EventEmitter {
  constructor(dirname, options) {
    super()
    this.dirname = dirname
    this.targetDir = path.join(process.cwd(), dirname)
    this.options = new CreatorOptions(options)
    this.generator = new Generator(this.targetDir)

    this.allFeatures = []
    this.prompts = {
      preset: {
        name: 'preset',
        type: 'list',
        message: 'Please pick a preset:',
        choices: () => {
          const { allFeatures } = this
          return [
            {
              name: `default ${chalk.yellow(`(${allFeatures.join(', ')})`)}`,
              short: `default ${chalk.yellow(`(${allFeatures.join(', ')})`)}`,
              value: allFeatures,
            },
            {
              name: 'Manually select features',
              short: 'Manually select features',
              value: '__manual__',
            },
          ]
        },
      },
      features: {
        name: 'features',
        type: 'checkbox',
        message: 'Check the features needed for your project',
        when: answers => answers.preset === '__manual__',
        choices: [],
        pageSize: 10,
      },
      info: [],
    }
    this.extraPrompts = []
    this.promptCallbacks = []
  }

  addPrompt(prompt) {
    this.extraPrompts.push(prompt)
  }

  addInfoPrompt(prompt) {
    this.prompts.info.push(prompt)
  }

  addPromptOption(name, option) {
    this.prompts[name].choices.push(option)
    if (name === 'features') {
      this.allFeatures.push(option.name)
    }
  }

  addPromptCallback(callback) {
    this.promptCallbacks.push(callback)
  }

  async requireFromTargetDir(filepath) {
    const absolutePath = path.join(process.cwd(), this.dirname, filepath)
    if (await fs.pathExists(absolutePath)) {
      return require(absolutePath)
    }
  }

  async getDirectoryAction(actions) {
    const { targetDir } = this
    const prompt = await inquirer.createPromptModule()
    const { action } = await prompt({
      name: 'action',
      type: 'list',
      message: `Target directory ${chalk.cyan(targetDir)} already exists! Choose an action:`,
      choices: actions,
    })
    return action
  }

  /**
   * operate target directory and return the action that represent what have been done
   */
  async operateTargetDir(overwrite) {
    const { targetDir } = this
    const dirExists = await fs.pathExists(targetDir)
    if (!dirExists) {
      return null
    }

    const operator = new DirectoryOperator(this)
    const dirAction = overwrite
      ? constant.dirAction.OVERWRITE
      : await this.getDirectoryAction(operator.actions)
    await operator[dirAction]()
    return dirAction
  }

  // get features that needed for the project
  async getPreset() {
    const { options } = this
    const prompt = inquirer.createPromptModule()

    let answers
    if (options.get('default')) {
      answers = {
        features: this.allFeatures,
      }
    } else {
      answers = await prompt([
        this.prompts.preset,
        this.prompts.features,
        ...this.extraPrompts,
      ])
      answers.features = answers.features || answers.preset
    }

    const preset = new Proxy({}, {
      set(target, name, value) {
        assert(!(name in target), `[name:${name}] already exists in preset!`)
        target[name] = value
      },
    })
    for (const callback of this.promptCallbacks) {
      callback(answers, preset)
    }

    return preset
  }

  // get info settings from user local files
  async loadLocalInfo() {
    const localPackage = await this.requireFromTargetDir('package.json')
    const localInfo = {}
    // get settings if package.json exists
    if (localPackage) {
      const requiredFields = requiredInfoFields.package
      for (const field of requiredFields) {
        if (localPackage[field] !== undefined) {
          localInfo[field] = localPackage[field]
        }
      }
    }

    return localInfo
  }

  // get setting of project infos
  async getInfoSetting(required, useLocalInfo) {
    const localInfo = useLocalInfo
      ? await this.loadLocalInfo()
      : {}
    const requiredNames = Object.keys(requiredInfoFields).filter(name => required[name])
    const requiredFields = []
      .concat(...requiredNames.map(name => requiredInfoFields[name]))
      // there is no need to set the fields that already have value
      .filter(field => !(field in localInfo))
    const infoPrompts = this.prompts.info.filter(p => requiredFields.includes(p.name))

    const promptInfo = infoPrompts.length > 0
      ? await inquirer.createPromptModule()(infoPrompts)
      : null
    const info = {
      ...localInfo,
      ...promptInfo,
    }
    return info
  }

  /**
   * get settings of user info
   * @param {object} required parts that need setting
   * @param {boolean} required.package whether to config package.json
   * @param {boolean} required.readme whether to config README.md
   * @return {{info: {}, preset: {}}}
   */
  async getUserSettings(required, dirAction) {
    const useExistedInfo = dirAction === constant.dirAction.MERGE
    const settings = {
      preset: await this.getPreset(),
      info: await this.getInfoSetting(required, useExistedInfo),
    }
    return settings
  }

  async generateFiles(metadata, options) {
    spinner.logWithSpinner('🚀', 'Generating files...')
    await this.generator.generate(metadata, options)
    spinner.stopSpinner()
  }

  installDependencies() {
    const { targetDir } = this
    logger.log('📦  Installing dependencies. This might take a while...')
    logger.log()
    execSync(useYarn ? 'yarn install' : 'npm install', {
      stdio: [0, 1, 2],
      cwd: targetDir,
    })
  }

  infoRequired() {
    const { renderFiles } = this.generator
    return {
      package: renderFiles.includes('package.json'),
      readme: renderFiles.includes('README.md'),
    }
  }

  async create() {
    const { dirname: name, options, targetDir } = this
    const dirAction = await this.operateTargetDir(options.get('force'))
    const meta = await this.getUserSettings({
      ...this.infoRequired(),
    }, dirAction)

    logger.log()

    spinner.logWithSpinner('✨', `Creating project in ${chalk.yellow(targetDir)}.`)
    await this.generateFiles(meta, {
      type: options.get('type'),
    })
    if (options.get('install')) {
      await this.installDependencies()
    }

    spinner.stopSpinner()
    logger.log()
    logger.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
    logger.log('👉  Get started with the following commands:\n')
    if (name.trim() !== '.') {
      logger.command(`cd ${name}`)
    }
    if (!options.get('install')) {
      logger.command(useYarn ? 'yarn install' : 'npm install')
    }
    logger.command(useYarn ? 'yarn dev' : 'npm run dev')
    logger.log()
  }
}

module.exports = Creator
