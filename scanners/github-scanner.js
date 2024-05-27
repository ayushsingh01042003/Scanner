import { Octokit } from 'octokit';
import { scanFileContent } from './pii-scanner.js';
import process from 'dotenv'

async function scanGitHubRepository(owner, repo, regexPairs) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN 
  });

  try {
    const response = await octokit.rest.repos.getContent({ owner, repo, path: '' });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Unexpected response from GitHub API');
    }

    const piiVulnerabilities = {};

    for (const file of response.data) {
      if (file.type === 'file') {
        const fileContentResponse = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path
        });
        console.log(fileContentResponse);
        const fileContent = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf-8');

        console.log(fileContent);

        const filePiiVulnerabilities = scanFileContent(fileContent, regexPairs);

        console.log(`PII vulnerabilities in ${file.path}:`, filePiiVulnerabilities);

        if (Object.keys(filePiiVulnerabilities).length > 0) {
          piiVulnerabilities[file.path] = filePiiVulnerabilities;
        }
      }
    }

    return piiVulnerabilities;
  } catch (error) {
    console.error('Error scanning GitHub repository:', error);
    throw error;
  }
}

export { scanGitHubRepository };
