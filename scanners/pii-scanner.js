import { readFile } from '../utils/file-utils.js';

export function scanFileContent(fileContent, regexPairs) {
  const piiVulnerabilities = {};

  Object.entries(regexPairs).forEach(([piiType, regexPattern]) => {
    const regex = new RegExp(regexPattern, 'g');
    const matches = fileContent.match(regex) || [];

    if (matches.length > 0) {
      piiVulnerabilities[piiType] = matches;
    }
  });

  return piiVulnerabilities;
}

export function scanFiles(filePaths, regexPairs) {
  const piiVulnerabilities = {};

  filePaths.forEach((filePath) => {
    const fileContent = readFile(filePath);
    const filePiiVulnerabilities = scanFileContent(fileContent, regexPairs);

    if (Object.keys(filePiiVulnerabilities).length > 0) {
      piiVulnerabilities[filePath] = filePiiVulnerabilities;
    }
  });

  return piiVulnerabilities;
}
