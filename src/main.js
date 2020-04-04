const program = require('commander')
const create = require('./commands/create')

let actionMap = {
  // 项目创建
  create: {
    description: '创建一个新的项目', // 描述
    usages: [
      // 使用方法
      'lnc create ProjectName',
    ],
    alias: 'c', // 命令简称
  },
};

// 添加create命令
Object.keys(actionMap).forEach((action) => {
  if (actionMap[action].options) {
    Object.keys(actionMap[action].options).forEach((option) => {
      let obj = actionMap[action].options[option];
      program.option(obj.flags, obj.description, obj.defaultValue);
    });
  }

  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action(() => {
      switch (action) {
        case 'create':
          create(...process.argv.slice(3));
          break;
        default:
          break;
      }
    });
});

// 项目版本
program
  .version(require('../package.json').version, '-v --version')
  .parse(process.argv);

/**
 * 命令后不带参数的时候，输出帮助信息
 */
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
