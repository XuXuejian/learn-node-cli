const program = require('commander')
const create = require('./commands/create')
const generate = require('./commands/generate')

let actionMap = {
  // 项目创建
  create: {
    description: '创建一个新的项目',
    usages: [
      'lnc create ProjectName',
    ],
    alias: 'c',
  },
  // 生成模块
  generate: {
    description: '生成模块代码',
    usages: [
      'lnc generate ModuleName'
    ],
    alias: 'g',
  }
};

// 添加命令
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
        case 'generate':
          generate(...process.argv.slice(3));
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
