const fileUtils = require('../utils/file-utils');

function scanFiles(filePaths, regexPairs) {
  const piiVulnerabilities = {};

  filePaths.forEach((filePath) => {
    const fileContent = fileUtils.readFile(filePath);

    Object.entries(regexPairs).forEach(([piiType, regexPattern]) => {
      const regex = new RegExp(regexPattern, 'g');
      const matches = fileContent.match(regex) || [];

      if (matches.length > 0) {
        if (!piiVulnerabilities[piiType]) {
          piiVulnerabilities[piiType] = {};
        }

        if (!piiVulnerabilities[piiType][filePath]) {
          piiVulnerabilities[piiType][filePath] = [];
        }

        piiVulnerabilities[piiType][filePath] = [...piiVulnerabilities[piiType][filePath], ...matches];
      }
    });
  });

  return piiVulnerabilities;
}

module.exports = {
  scanFiles,
};