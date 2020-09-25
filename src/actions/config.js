const fs = require('fs');
const { encode, decode } = require('ini');
const { defaultConfig, configFile } = require('../utils/constants');

module.exports = (action, k, v) => {
  const flag = fs.existsSync(configFile);
  const obj = { ...defaultConfig };

  if (flag) { // 配置文件存在
    const content = fs.readFileSync(configFile, 'utf8');
    const c = decode(content);
    Object.assign(obj, c);
  } else {
    fs.writeFileSync(configFile, encode(defaultConfig));
  }

  // action
  if (action === 'get') {
    console.log(obj[k]);
  } else if (action === 'set') {
    obj[k] = v;
    fs.writeFileSync(configFile, encode(obj));
    console.log('setting success!')
  } else if (action === 'getVal') {
    return obj[k];
  }
};