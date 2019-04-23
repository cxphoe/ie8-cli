const inquirer = require('inquirer')

exports.confirm = async function (message) {
  const question = {
    name: 'confirm',
    type: 'confirm',
    message,
  }
  return inquirer
    .prompt([question])
    .then(({ confirm }) => confirm)
}
