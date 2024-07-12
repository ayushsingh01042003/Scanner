export function scanFileContent(fileContent, regexPairs) {
  const piiVulnerabilities = {};

  Object.entries(regexPairs).forEach(([piiType, regexPattern]) => {
    const regex = new RegExp(regexPattern, 'g');
    const lines = fileContent.split('\n');
    
    lines.forEach((line, index) => {
      const matches = line.match(regex) || [];
      if (matches.length > 0) {
        if (!piiVulnerabilities[piiType]) {
          piiVulnerabilities[piiType] = [];
        }
        matches.forEach(match => {
          piiVulnerabilities[piiType].push(`${match} (line ${index + 1})`);
        });
      }
    });
  });

  return piiVulnerabilities;
}