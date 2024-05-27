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