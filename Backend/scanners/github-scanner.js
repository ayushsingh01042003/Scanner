import { Octokit } from 'octokit';
import { scanFileContent } from './pii-scanner.js';
import dotenv from 'dotenv';
dotenv.config();

async function scanGitHubRepository(owner, repo, regexPairs) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const piiVulnerabilities = {};

    const scanDirectory = async (path) => {
      const response = await octokit.rest.repos.getContent({ owner, repo, path });
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Unexpected response from GitHub API');
      }
      for (const item of response.data) {
        if (item.type === 'file') {
          const fileContentResponse = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: item.path,
          });
          const fileContent = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf-8');
          const filePiiVulnerabilities = scanFileContent(fileContent, regexPairs);
          
          Object.entries(filePiiVulnerabilities).forEach(([piiType, matches]) => {
            if (!piiVulnerabilities[piiType]) {
              piiVulnerabilities[piiType] = {};
            }
            piiVulnerabilities[piiType][item.path] = matches;
          });
        } else if (item.type === 'dir') {
          await scanDirectory(`${path}/${item.name}`);
        }
      }
    };

    await scanDirectory("");
    return piiVulnerabilities;
  } catch (error) {
    console.error('Error scanning GitHub repository:', error);
    throw error;
  }
}

export { scanGitHubRepository };