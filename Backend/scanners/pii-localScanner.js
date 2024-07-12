import { readFile } from '../utils/file-utils.js'

function scanFiles(filePaths, regexPairs) {
  const piiVulnerabilities = {};

  filePaths.forEach((filePath) => {
    const fileContent = readFile(filePath);
    const lines = fileContent.split('\n');

    Object.entries(regexPairs).forEach(([piiType, regexPattern]) => {
      const regex = new RegExp(regexPattern, 'g');

      lines.forEach((line, index) => {
        const matches = line.match(regex) || [];

        if (matches.length > 0) {
          if (!piiVulnerabilities[piiType]) {
            piiVulnerabilities[piiType] = {};
          }

          if (!piiVulnerabilities[piiType][filePath]) {
            piiVulnerabilities[piiType][filePath] = [];
          }

          matches.forEach(match => {
            piiVulnerabilities[piiType][filePath].push(`${match} (line ${index + 1})`);
          });
        }
      });
    });
  });

  return piiVulnerabilities;
}

export default scanFiles;