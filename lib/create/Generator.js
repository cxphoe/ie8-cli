const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const pkg = require('../../package.json')

const FileRenderer = require('./FileRenderer')
const {
  getFilePaths,
} = require('../../utils/file')

module.exports = class Generator {
  /**
   * 文件内容渲染器，可根据预设的分隔符，将分隔符中的内容进行渲染
   *
   * TODO
   * 目前模板固定假设为 ejs，后期可能需要做一层转化
   *
   * @param {string} targetDir 目标目录
   */
  constructor(targetDir) {
    this.targetDir = targetDir
    this.tmpDir = path.join(os.tmpdir(), pkg.name, 'template/webpack')
    this.renderer = new FileRenderer({
      prefix: '/*',
      suffix: '*/',
    })
    this.excludedFiles = []
    this.renderFiles = [
      'package.json',
      'babel.config.js',
      'README.md',
      'config',
    ]
  }

  /**
   * add excluded files which will not be copied into targetDir
   * @param {string[]} filePaths file paths based on this.targetDir
   */
  addExcludedFiles(...filePaths) {
    this.excludedFiles.push(...filePaths)

    // excluded files don't need to render
    const renderFiles = new Set(this.renderFiles)
    for (const fp of filePaths) {
      renderFiles.delete(fp)
    }
    this.renderFiles = [...renderFiles]
  }

  async renderTemplate(metadata, templateDir) {
    const renderFiles = await getFilePaths(templateDir, {
      relativePaths: this.renderFiles,
    })
    await this.renderer.render(renderFiles, metadata)
  }

  async copyTemplate({
    targetDir,
    preset = {},
    exclude = [],
    overwrite = false,
    type,
  }) {
    overwrite && await fs.remove(targetDir)

    const templateDir = path.resolve(__dirname, '../../templates/webpack')
    const defaultDir = path.join(templateDir, 'default')
    await fs.copy(defaultDir, targetDir)

    for (const dependent of Object.keys(preset)) {
      const dependentDir = path.join(templateDir, dependent)
      if (['typescript', 'es'].includes(dependent)) {
        await fs.copy(path.join(dependentDir, type), targetDir)
      } else if (fs.existsSync(dependentDir)) {
        await fs.copy(dependentDir, targetDir)
      }
    }

    for (const filepath of exclude) {
      await fs.remove(path.join(targetDir, filepath))
    }
  }

  async generateTemplateInTmp(metadata, {
    type,
  }) {
    await this.copyTemplate({
      targetDir: this.tmpDir,
      preset: metadata.preset,
      exclude: this.excludedFiles,
      overwrite: true,
      type,
    })
    await this.renderTemplate({
      ...metadata,
      type: {
        [type]: true,
      },
    }, this.tmpDir)
  }

  async copyTemplateFromTmp() {
    await fs.copy(this.tmpDir, this.targetDir)
  }

  async generate(metadata, options) {
    await this.generateTemplateInTmp(metadata, options)
    await this.copyTemplateFromTmp()
  }
}
