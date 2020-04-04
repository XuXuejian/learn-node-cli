const fs = require('fs');
const symbol = require('log-symbols');
const chalk = require('chalk');
const inquirer = require('inquirer');
const downloadGit = require('download-git-repo');

// 文件是否存在
function notExistFold(name) {
  return new Promise((resolve) => {
    if (fs.existsSync(name)) {
      console.log(
        symbol.error,
        chalk.red('文件夹名已被占用，请更换名字重新创建')
      );
    } else {
      resolve();
    }
  });
}

// 询问用户
const promptList = [
  {
    type: 'list',
    name: 'frame',
    message: 'please select this project template',
    choices: ['vue', 'react', 'angular'],
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please enter the project description: ',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Please enter the author name: ',
  },
];

function prompt() {
  return new Promise((resolve) => {
    inquirer.prompt(promptList).then((answer) => {
      resolve(answer);
    });
  });
}

// 项目模板远程下载
function downloadTemplate(ProjectName, repo) {
  return new Promise((resolve, reject) => {
    downloadGit(repo, ProjectName, { clone: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// 更新json配置文件
const updateJsonFile = (fileName, obj) => {
  return new Promise((resolve) => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      const json = JSON.parse(data);
      Object.keys(obj).forEach((key) => {
        json[key] = obj[key];
      });
      fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
      resolve();
    }
  });
};

module.exports = {
  notExistFold,
  prompt,
  downloadTemplate,
  updateJsonFile,
};
