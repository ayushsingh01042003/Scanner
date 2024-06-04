import express from 'express';
import { scanGitHubRepository } from './scanners/github-scanner.js';
import cors from 'cors'
import dotenv from "dotenv"
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});