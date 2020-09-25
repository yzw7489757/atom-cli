const commander = require('commander');
const program = new commander.Command();
const { version } = require('../package.json');
const path = require('path');
const actionsMap = require('./utils/actionMap');


for(const action in actionsMap) {
  const actionContent = actionsMap[action]
  // program.option(`-${actionContent.alias}, --${actionContent.completeAlias}`, actionContent.description)
  const result = program.command(action) // 命令的名称

  if(actionContent.alias) {
    result.alias(actionContent.alias) // 命令的别名, * 不存在，会导致返回undefined
  }

  result
  .description(actionContent.description)
  .action((source, description) => {
    if (action === '*') {
      console.log(description);
    } else { // 引用对应的动作文件 将参数传入
      require(path.resolve(__dirname + '/actions', action))(...process.argv.slice(3));
    }
  });
}

// 监听help
program.on('--help', () => {
  console.log('Examples');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`${example}`);
    });
  });
});

program.version(version)
  .parse(process.argv);