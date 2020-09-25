const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.atomrc`;
const cacheFolder = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.atom-cache`;

const USERNAME = 'yzw7489757'

const defaultConfig = {
  userName: USERNAME,
  register: "github",
  protocol: 'https'
}

module.exports = {
  downloadDirectory,
  defaultConfig,
  configFile,
  cacheFolder
}