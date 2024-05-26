const path = require('path');
const fileUtils = require('../utils/file-utils');

function scanDirectory(directory, extensions) {
  const filePaths = [];

  function traverseDirectory(currentPath) {
    const files = fileUtils.readDirectory(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stats = fileUtils.getFileStats(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else if (extensions.includes(path.extname(filePath))) {
        filePaths.push(filePath);
      }
    });
  }

  traverseDirectory(directory);

  return filePaths;
}

module.exports = {
  scanDirectory,
};