import fs from 'fs';

export function readDirectory(directory) {
  return fs.readdirSync(directory);
}

export function getFileStats(filePath) {
  return fs.statSync(filePath);
}

export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export default {
  readDirectory,
  getFileStats,
  readFile,
};