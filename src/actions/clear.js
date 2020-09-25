const { clearCache } = require('../utils/cache')

module.exports = (...args) => {
  clearCache(...args);
};