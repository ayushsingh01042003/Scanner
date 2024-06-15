import express from 'express';
import { scanGitHubRepository } from './scanners/github-scanner.js';
import scanDirectory from './scanners/file-scanner.js';
import scanFiles from './scanners/pii-localScanner.js';
import { analyzeLocalDirectory, analyzeGitHubRepository } from './utils/language-analyzer.js';
import { Octokit } from 'octokit';
import cors from 'cors';
import dotenv from "dotenv";
import remainingRequest from './utils/request-remaining.js';
import mailData from './utils/mail.js';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.post('/scan-github', async (req, res) => {
  const { owner, repo, regexPairs } = req.body;

  try {
    const piiVulnerabilities = await scanGitHubRepository(owner, repo, regexPairs);
    res.json(piiVulnerabilities);
  } catch (error) {
    console.error('Error scanning GitHub repository:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to scan GitHub repository' });
  }
});

app.post('/scan-directory', (req, res) => {
  const { directoryPath, regexPairs } = req.body;

  if (!directoryPath || typeof directoryPath !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing directoryPath in request body' });
  }

  if (!regexPairs || typeof regexPairs !== 'object') {
    return res.status(400).json({ error: 'Invalid or missing regexPairs in request body' });
  }

  try {
    const filePaths = scanDirectory(directoryPath);
    const piiVulnerabilities = scanFiles(filePaths, regexPairs);

    res.json(piiVulnerabilities);
  } catch (error) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ error: 'Failed to scan directory', details: error.message });
  }
});


app.post('/github-repo-stats', async (req, res) => {
  const { owner, repo } = req.body;

  if (!owner || typeof owner !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing owner in request body' });
  }

  if (!repo || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing repo in request body' });
  }

  try {
    const languageStats = await analyzeGitHubRepository(owner, repo, octokit);
    res.json(languageStats);
  } catch (error) {
    console.error('Error analyzing GitHub repository:', error);
    res.status(500).json({ error: 'Failed to analyze GitHub repository', details: error.message });
  }
});

app.post('/local-directory-stats', async (req, res) => {
  const { directoryPath } = req.body;

  if (!directoryPath || typeof directoryPath !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing directoryPath in request body' });
  }

  try {
    const languageStats = await analyzeLocalDirectory(directoryPath);//extensions to be scanned are written manually right now. Try to get some fix for that
    res.json(languageStats);
  } catch (error) {
    console.error('Error analyzing local directory:', error);
    res.status(500).json({ error: 'Failed to analyze local directory', details: error.message });
  }
});

app.post("/email",async (req, res) => {
  const {jsonData,receiverEmail} = req.body
  try{
    const result = await mailData(jsonData, receiverEmail)
    return res.send(result)
  } catch(err){
    return res.send("Unable to send email")
  }
  
})

app.get('/remaining_request', async (req, res)=>{
  try{
    const rem = await remainingRequest()
    res.send(`Number of Remaining Request: ${rem}`)
  } catch(err){
    return res.send("Unable to Fetch Remaining Request")
  }
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});