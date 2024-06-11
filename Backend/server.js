import express from 'express';
import { scanGitHubRepository } from './scanners/github-scanner.js';
import scanDirectory from './scanners/file-scanner.js';
import scanFiles from './scanners/pii-localScanner.js';
import cors from 'cors'
import dotenv from "dotenv"
import mailData from './utils/mail.js';
dotenv.config()


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/scan-github', async (req, res) => {
  const { owner, repo, regexPairs, fileExtensions } = req.body;

  try {
    const [piiVulnerabilities,remaining] = await scanGitHubRepository(owner, repo, regexPairs, fileExtensions);
    
    res.json({piiVulnerabilities,remaining});
  } catch (error) {
    console.error('Error scanning GitHub repository:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to scan GitHub repository' });
  }
});

app.post('/scan-directory', (req, res) => {
  const { directoryPath, extensionArray, regexPairs } = req.body;

  if (!directoryPath || typeof directoryPath !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing directoryPath in request body' });
  }

  if (!Array.isArray(extensionArray)) {
    return res.status(400).json({ error: 'extensionArray must be an array' });
  }

  if (!regexPairs || typeof regexPairs !== 'object') {
    return res.status(400).json({ error: 'Invalid or missing regexPairs in request body' });
  }

  try {
    const filePaths = scanDirectory(directoryPath, extensionArray);
    const piiVulnerabilities = scanFiles(filePaths, regexPairs);

    res.json(piiVulnerabilities);
  } catch (error) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ error: 'Failed to scan directory', details: error.message });
  }
});

app.post("/email",async (req, res) => {
  const {jsonData,receiverEmail} = req.body
  const result = await mailData(jsonData, receiverEmail)
  return res.send(result)
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});