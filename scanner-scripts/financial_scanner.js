const fs = require('fs');
const path = require('path');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Credit card number pattern
  const creditCardPattern = /\b\d{16}\b/g;
  const creditCards = content.match(creditCardPattern) || [];

  // Bank account number pattern
  const bankAccountPattern = /\b\d{12}\b/g;
  const bankAccounts = content.match(bankAccountPattern) || [];

  if (creditCards.length > 0 || bankAccounts.length > 0) {
    console.log(`Potential financial information found in ${filePath}:`);
    if (creditCards.length > 0) {
      console.log('Credit card numbers:');
      creditCards.forEach(cc => console.log(cc));
    }
    if (bankAccounts.length > 0) {
      console.log('Bank account numbers:');
      bankAccounts.forEach(ba => console.log(ba));
    }
  } else {
    console.log(`No potential financial information found in ${filePath}`);
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