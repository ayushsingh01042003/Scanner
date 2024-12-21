# Scanx

Scanx is a versatile regex-based artifact scanner designed to help teams and individuals identify sensitive data across local directories, GitHub repositories, and Splunk-integrated environments. It also leverages the Mistral AI API to suggest regex patterns based on project types, offering comprehensive scanning capabilities.

## Features

### Scanning Capabilities
- **Local Directory Scanning**: Perform regex-based scans on local directories to detect sensitive information.
- **GitHub Repository Scanning**: Scan GitHub repositories via the GitHub API to identify artifacts.
- **Dynamic Scanning**: Integrate with Splunk for real-time scanning of logs and dynamic data streams.

### Reporting
- Generate detailed scan reports.
- Options to download or email the reports.

### Regex Suggestions
- Use the Mistral AI API to get regex pattern suggestions based on your project's type.

### Account Types
- **Personal Accounts**:
  - Scan projects and generate reports.
- **Manager/Team Accounts**:
  - Add team members.
  - View all scans conducted by added users.
- **Enterprise/Admin Accounts**:
  - View all scans conducted across all teams and users.

## Setup

### Environment Variables
Create a `.env` file and include the following variables:

- `GITHUB_TOKEN`: Token for accessing the GitHub API. [How to generate a GitHub token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
- `MONGO_DB_URI`: MongoDB connection string.
- `MISTRAL_API_KEY`: API key for Mistral AI regex suggestions.[How to generate a Mistral API Key](https://docs.mindmac.app/how-to.../add-api-key/create-mistral-ai-api-key)
- `EMAIL`: Email address used to send reports.
- `EMAIL_PASSWORD`: Application-specific password for the sender email. [How to generate a Google App Password](https://support.google.com/accounts/answer/185833?hl=en).
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.

#### Optional Variables for Dynamic Scanning
- `SPLUNK_HOST`: Splunk server host.
- `SPLUNK_PORT`: Splunk server port.
- `SPLUNK_USERNAME`: Splunk username.
- `SPLUNK_PASSWORD`: Splunk password.

### Local Development

1. Create a `.env` file and populate it with the required variables.
2. Navigate to the frontend and backend directories and run:
   ```bash
   npm install
   ```
3. Start the development servers:
   ```bash
   npm run dev
   ```

## Contributing
We welcome contributions from the community. If you are interested in contributing, please fork the repository and submit a pull request.

### Contributors
- [ayushsingh01042003](https://github.com/ayushsingh01042003)
- [MckinellGreen7](https://github.com/MckinellGreen7)
- [smk927](https://github.com/smk927)
- [Cobalt9000](https://github.com/Cobalt9000)
- [ArshGupta74](https://github.com/ArshGupta74)

