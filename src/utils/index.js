
const fs = require('fs');
const path = require('path');

const wrapFetchAddLoding = (fn, message) => async (...args) => {
  const spinner = require('ora')(message);
  spinner.start(); // 开始loading
  const r = await fn(...args);
  spinner.succeed(); // 结束loading
  return r;
};

// 支持 a/b/c/d.json 不用考虑a/b是否存在
const judeDirExist = (root, path = '', fileType = '') => {
  if (!path) throw new Error('path is required');

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  const pathFields = path.split('/').filter(Boolean)
  const fileName = pathFields.pop()
  let writePath = root
  let field

  while (field = pathFields.shift()) {
    writePath += `/${field}`
    if (!fs.existsSync(writePath)) {
      fs.mkdirSync(writePath)
    }
  }

  return `${writePath}/${fileName}${fileType ? `.${fileType}` : ''}`
}

/** 深度优先删除文件夹 */
function removeDir(dir, cb) {
  fs.readdir(dir, function (err, files) {
    if(!files) return
    next(0);
    function next(index) {
      if (index == files.length) return fs.rmdir(dir, cb);
      let newPath = path.join(dir, files[index]);
      fs.stat(newPath, function (err, stat) {
        if (err) {
          console.log(err);
          return
        }
        if (stat.isDirectory()) {
          removeDir(newPath, () => next(index + 1));
        } else {
          fs.unlink(newPath, function (err) {
            if (err) {
              console.error(err);
            }
            next(index + 1);
          });
        }
      })
    }
  })
}

module.exports = {
  wrapFetchAddLoding,
  judeDirExist,
  removeDir
}