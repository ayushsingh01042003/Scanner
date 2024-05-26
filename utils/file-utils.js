const fs = require('fs');
const path = require('path');

function readDirectory(directory) {
  return fs.readdirSync(directory);
}

function getFileStats(filePath) {
  return fs.statSync(filePath);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

module.exports = {
  readDirectory,
  getFileStats,
  readFile,
};