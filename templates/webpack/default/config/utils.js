const path = require('path');
const fs = require('fs');

const isCopiedJsFile = (compiledPath) => {
  const filepath = path.join(__dirname, '../src', compiledPath);
  return fs.existsSync(filepath);
};

module.exports = {
  isCopiedJsFile,
};
