const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const symbol = require('log-symbols');
const inquirer = require('inquirer');
const { folderIsEmpty } = require('../utils');

const moduleTemplatePath = path.join(__dirname, '../templates/module');
const moduleTargetPath = process.cwd();

function copyFileSync(source, target) {
  let targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
function deleteFolderRecursiveSync(paths) {
  console.log('paths: ', paths);
  if (fs.lstatSync(paths).isDirectory()) {
    if (folderIsEmpty(paths)) {
      fs.rmdirSync(paths);
    } else {
      const files = fs.readdirSync(paths);
      files.forEach((file) => {
        console.log('file: ', file);
        deleteFolderRecursiveSync(path.join(paths, file));
      });
    }
  } else {
    fs.unlinkSync(paths);
  }
}
const copyTemplate = (moduleName) => {
  const targetFolder = path.join(moduleTargetPath, moduleName);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  fs.readdir(moduleTemplatePath, { encoding: 'utf8' }, (err, files) => {
    if (!err) {
      console.log(files);
      files.forEach((file) => {
        const filePath = path.join(moduleTemplatePath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          copyFolderRecursiveSync(filePath, targetFolder);
        } else {
          copyFileSync(filePath, targetFolder);
        }
      });
    } else {
      console.log(symbol.error, chalk.redBright('复制模版失败'));
    }
  });
};

const generate = (moduleName) => {
  if (!moduleName) {
    console.log(symbol.error, chalk.redBright('请输入moduleName'));
  } else {
    const modulePath = path.join(moduleTargetPath, moduleName);
    if (fs.existsSync(modulePath)) {
      console.log('当前已存在');
      inquirer
        .prompt([
          {
            name: 'module override',
            type: 'confirm',
            message: `${moduleName}模块已存在，是否覆盖它？`,
          },
        ])
        .then((answer) => {
          if (answer['module override']) {
            console.log('answer: ', answer['module override']);
            deleteFolderRecursiveSync(modulePath);
            copyTemplate(moduleName);
            console.log(symbol.success, chalk.greenBright('模版创建成功'));
          }
        });
    } else {
      copyTemplate(moduleName);
      console.log(symbol.success, chalk.greenBright('模版创建成功'));
    }
  }
};

module.exports = generate;
