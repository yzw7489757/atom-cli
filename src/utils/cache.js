const { cacheFolder, downloadDirectory } = require('./constants');
const fs = require('fs');
const { judeDirExist, removeDir } = require('./index');


const setCache = (name, data, type = 'json') => {
  try {
    fs.writeFileSync(judeDirExist(cacheFolder, name, type), JSON.stringify(data))
  } catch (err) {
    console.log(err)
  }
}

const readCache = (name, defaultValue, type = 'json') => {
  const fileName = judeDirExist(cacheFolder, name, type);

  if (!fs.existsSync(fileName)) {
    return defaultValue
  }
  
  if(['js', 'json', 'ts'].indexOf(type) > -1) {
    return require(fileName)
  }

  let content = fs.readFileSync(fileName, 'utf-8')
  
  return content
}

const clearCache = () => {
  const promisify = (fn) => (...args) => {
    return new Promise(reslove => {
      fn(...args, reslove)
    })
  }

  Promise.all([
    promisify(removeDir)(cacheFolder),
    promisify(removeDir)(downloadDirectory)
  ]).then(() => {
    console.log(`\n clear all task.\n`)
  })
}

module.exports = {
  readCache,
  setCache,
  clearCache
}