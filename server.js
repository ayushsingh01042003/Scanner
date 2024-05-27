import express from 'express';
import { scanGitHubRepository } from './scanners/github-scanner.js';

const app = express();
const port = 3000;

app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});