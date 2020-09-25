// https://github.com/SBoudrias/Inquirer.js#question

module.exports = [{
  type: "input",
  message: '项目名称',
  name: 'projectName',
  default: 'atom',
}, {
  type: "list",
  name: 'license',
  choices: [
    { name: 'MIT', value: 'MIT' },
    { name: 'ISC', value: 'ISC' }
  ],
  default: 'MIT'
}]