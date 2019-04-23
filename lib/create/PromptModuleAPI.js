module.exports = class PromptModuleAPI {
  constructor(creator) {
    this.creator = creator
  }

  injectFeature(feature) {
    this.creator.addPromptOption('features', feature)
  }

  injectPrompt(prompt) {
    this.creator.addPrompt(prompt)
  }

  injectInfo(info) {
    this.creator.addInfoPrompt(info)
  }

  injectOptionForPrompt(name, options) {
    this.creator.addPromptOptions(name, options)
  }

  onPromptComplete(callback) {
    this.creator.addPromptCallback(callback)
  }
}
