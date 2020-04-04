const symbol = require('log-symbols');
const chalk = require('chalk');
const ora = require('ora');

const {
  notExistFold,
  prompt,
  downloadTemplate,
  updateJsonFile,
} = require('../utils');

let create = (ProjectName) => {
  // 项目名不能为空
  if (ProjectName === undefined) {
    console.log(symbol.error, chalk.redBright('创建项目的时候，请输入项目名'));
  } else {
    // 如果文件名不存在则继续执行,否则退出
    notExistFold(ProjectName).then(() => {
      // 用户询问交互
      prompt().then((answer) => {
        if (answer.frame === 'angular') {
          console.log(
            symbol.warning,
            chalk.yellow('没有angular模板，我写着玩的~~')
          );
          process.exit(1);
        }

        /**
         * 根据用户输入的配置信息下载模版&更新模版配置
         * 下载模版比较耗时,这里通过ora插入下载loading, 提示用户正在下载模版
         */
        const loading = ora('downloading...');
        const spinner = loading.start();

        let repo = '';
        switch (answer.frame) {
          case 'vue':
            repo = 'direct:https://github.com/XuXuejian/free-love.git';
            break;
          case 'react':
            repo = 'direct:https://github.com/XuXuejian/free-love.git';
            break;
          default:
            break;
        }

        downloadTemplate(ProjectName, repo).then(
          () => {
            // 下载完成后,根据用户输入更新配置文件
            const fileName = `${ProjectName}/package.json`;
            answer.name = ProjectName;
            updateJsonFile(fileName, answer).then(() => {
              spinner.stop();
              console.log(symbol.success, chalk.green('download successed!'));
            });
          },
          () => {
            spinner.stop();
            console.log(symbol.error, chalk.redBright('download failed...'));
          }
        );
      });
    });
  }
};

module.exports = create;
