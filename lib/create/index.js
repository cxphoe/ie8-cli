const fs = require('fs-extra')
const path = require('path')
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')

const loadPromptModules = (cli, options) => {
  const modules = fs.readdirSync(path.resolve(__dirname, '../promptModules'))
  for (const m of modules) {
    require(`../promptModules/${m}`)(cli, options)
  }
}

module.exports = async (name, options) => {
  const creator = new Creator(name, options)
  const promptCli = new PromptModuleAPI(creator)

  loadPromptModules(promptCli, creator.options)
  await creator.create()
}
