const express = require('express');
const path = require('path');
const ssnScanner = require('./scanner-scripts/ssn_scanner');
const financialScanner = require('./scanner-scripts/financial_scanner');

const app = express();
const port = 3000;

const codebaseDirectory = path.join(__dirname, '..', 'codebase');

app.get('/ssn', (req, res) => {
  ssnScanner.scanDirectory(codebaseDirectory);
  res.send('SSN scanning completed. Check the console for the results.');
});

app.get('/financial', (req, res) => {
  financialScanner.scanDirectory(codebaseDirectory);
  res.send('Financial information scanning completed. Check the console for the results.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});