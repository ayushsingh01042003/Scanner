import path from 'path'
import { readDirectory, getFileStats } from '../utils/file-utils.js'

function scanDirectory(directory) {
  const filePaths = [];

  function traverseDirectory(currentPath) {
    const files = readDirectory(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stats = getFileStats(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else {
        filePaths.push(filePath);
      }
    });
  }

  traverseDirectory(directory);

  return filePaths;
}

export default scanDirectory