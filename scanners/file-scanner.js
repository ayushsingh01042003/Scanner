// import path from 'path'
// import fileUtils from '../utils/file-utils.js';

// export function scanDirectory(directory, extensions) {
//   const filePaths = [];

//   function traverseDirectory(currentPath) {
//     const files = fileUtils.readDirectory(currentPath);

//     files.forEach((file) => {
//       const filePath = path.join(currentPath, file);
//       const stats = fileUtils.getFileStats(filePath);

//       if (stats.isDirectory()) {
//         traverseDirectory(filePath);
//       } else if (extensions.includes(path.extname(filePath))) {
//         filePaths.push(filePath);
//       }
//     });
//   }

//   traverseDirectory(directory);

//   return filePaths;
// }
