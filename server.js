const express = require('express');
const path = require('path');
const fileScanner = require('./scanners/file-scanner');
const piiScanner = require('./scanners/pii-scanner');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/config', (req, res) => {
  const { extensionArray, regexPairs } = req.body;
  const codebaseDirectory = path.join(__dirname, '..', 'codebase');

  const filePaths = fileScanner.scanDirectory(codebaseDirectory, extensionArray);
  const piiVulnerabilities = piiScanner.scanFiles(filePaths, regexPairs);

  res.json(piiVulnerabilities);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});