const fs = require('fs');
const path = require('path');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Social Security Number pattern
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = content.match(ssnPattern) || [];

  if (ssns.length > 0) {
    console.log(`Potential SSN vulnerabilities found in ${filePath}:`);
    ssns.forEach(ssn => console.log(ssn));
  } else {
    console.log(`No potential SSN vulnerabilities found in ${filePath}`);
  }
}

function scanDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDirectory(filePath);
    } else {
      scanFile(filePath);
    }
  });
}

module.exports = {
  scanDirectory,
};