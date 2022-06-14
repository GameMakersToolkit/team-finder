const path = require('path');

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = { __esModule: true, default: ${JSON.stringify(path.basename(sourcePath))} };`,
    };
  },
};