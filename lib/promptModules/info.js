const prompts = [
  {
    name: 'name',
    message: 'Please enter the name of your project:',
    description: 'project name',
    type: 'input',
    validate(input) {
      const done = this.async()
      if (input.trim().length === 0) {
        return done('Project name can not be empty!')
      }
      done(null, true)
    },
  },
  {
    name: 'version',
    message: 'Please enter version of your project:',
    default: '0.1.0',
    type: 'input',
    validate(input) {
      const value = input.trim()
      const done = this.async()
      if (/^\d+(\.\d+){0,2}$/.test(value)) {
        done(null, true)
      } else {
        done('输入的版本号格式不正确！')
      }
    },
  },
  {
    name: 'description',
    message: 'Please enter the desciption of your project',
    type: 'input',
    description: 'project description',
    default: '',
  },
  {
    name: 'author',
    message: 'Please enter the author',
    type: 'input',
    desciption: 'project author',
    default: '',
  },
  {
    name: 'license',
    message: 'Please enter the license',
    type: 'input',
    desciption: 'project license',
    default: 'ISC',
  },
]

module.exports = cli => {
  for (const prompt of prompts) {
    cli.injectInfo(prompt)
  }
}
