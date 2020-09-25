// https://github.com/SBoudrias/Inquirer.js#question

module.exports = (preParams) => {
  return [{
    type: "input",
    message: '项目名称',
    name: 'projectName',
    default: preParams.projectName,
  }, {
    type: "list",
    name: 'license',
    choices: [
      { name: 'MIT', value: 'MIT' },
      { name: 'ISC', value: 'ISC' }
    ],
    default: 'MIT'
  }]
}