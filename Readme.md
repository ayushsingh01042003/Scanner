# Code Scanner

## Description 📝

### Code Scanner

Code Scanner is a web application that allows you to scan your codebase for sensitive information or patterns using regular expressions. It provides two main functionalities:

1. GitHub Repository Scanning: Scan public GitHub repositories for specific patterns defined by regular expressions. This can be useful for identifying potential security vulnerabilities or sensitive data leaks in your open-source projects.

2. Local Directory Scanning: Scan local directories on your machine for specific patterns defined by regular expressions. This can be helpful for auditing your private codebase or identifying issues within your development environment.

### Features

- Regular Expression Matching: Define custom regular expressions to search for patterns like Social Security numbers, credit card numbers, email addresses, or any other desired pattern.
- File Extension Filtering: Specify the file extensions you want to include in the scan, allowing you to focus on specific types of files (e.g., .java, .py, .js).
- GitHub Integration: Seamlessly scan public GitHub repositories by providing the repository owner and name.
- Local Directory Scanning: Scan directories on your local machine by specifying the directory path.
- User-friendly Interface: The application provides a straightforward user interface for configuring scan parameters and viewing results.

### Getting Started

To get started with Code Scanner, follow these steps:

1. Clone the repository:

```
git clone https://github.com/ayushsingh01042003/Scanner.git
```

2. Install dependencies for the frontend and backend:

Frontend: 
```
cd frontend
```
```
npm install
```
Backend: 
```
cd backend
```
```
npm install
```

3. Set up the required environment variables for the backend, GitHub API token, MONGO_DB_URI, GEMINI_API_KEY in .env file.

4. Start the frontend and backend servers:

Frontend: 
```
npm run dev
```
Backend: 
```
npm run start
```

5. Access the application in your web browser at ```http://localhost:5173``` and the server is hosted at ```http://localhost:3000```.

## Table of Contents 🗒

* [Dependencies](#dependencies-)
* [Usage](#usage-)
* [Contributors](#contributors-)
* [Installation](#backend-and-frontend-installation-steps-)
* [Questions](#questions-)
* [Example](#example-)

## Dependencies ⚙️

To install dependencies, run these commands:

For Frontend:
```
npm i @vitejs/plugin-react
npm i eslint
npm i tailwindcss
npm i vite
npm i jspdf
```
For Backend:
```
npm i cors
npm i axios
npm i dotenv
npm i express
npm i octokit
npm install @google-ai/generativelanguage
```
## Usage ⚒️

The proper usage of this repository involves the following steps:

1. Install dependencies (`npm install`)
2. Set up environment variables in `.env` file: GITHUB_TOKEN, MONGO_DB_URI, GEMINI_API_KEY
3. Start the development server (`npm run dev`)
4. Access the application in your browser (usually http://localhost:5173)
5. Enter the GitHub owner, repository name, file extensions, and regular expressions for PII detection
6. Click "Submit" to initiate the scan
7. View the scan results in the formatted JSON response
8. You can generate the report after scanning and then download that generated report in the report section.
9. Build for production using `npm run build`
10. View the logs in the terminal in Backend directory after running the server at http://localhost:3000/

The application provides a user interface for scanning public GitHub repositories for potential PII vulnerabilities based on the specified file extensions and regular expressions.

## Contributors 🧑‍💻

[ayushsingh01042003](https://github.com/ayushsingh01042003/), [MckinellGreen7](https://github.com/MckinellGreen7/), [smk927](https://github.com/smk927/), [Cobalt9000](https://github.com/Cobalt9000/), [ArshGupta74](https://github.com/ArshGupta74/), [bhuvankum4r](https://github.com/bhuvankum4r/), [niharika1708](https://github.com/niharika1708/), [hitha-n](https://github.com/hitha-n/) , [Sunidhi]

## Backend and Frontend installation steps 🪜:

### In the Backend folder:
```
npm i
node server.js

```
### In the Frontend folder:
```
npm i
npm run dev
```

Run these commands in their respective integrated terminals.

## Questions ❔

For additional questions, contact me at the email provided below. 

- GitHub: [ayushsingh01042003](https://github.com/ayushsingh01042003/)
 
- Email: arsh.gupta740@gmail.com

## Example 📋

The example key-value pair for the regexPairs and patterns are below:

Input template backend:

i> For /scan-github route
```
{
  "owner": "ayushsingh01042003",
  "repo": "DSA",
  "regexPairs": {
    "ssn": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
    "creditCard": "\\b\\d{16}\\b",
    "emailAddress": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:\\.[A-Za-z]{2,})?\\b"
  }
}
```

ii> For /scan-directory route
```
{
  "directoryPath": "/home/ayush/Progs/Cognizant/codebase",
  "regexPairs": {
    "ssn": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
    "creditCard": "\\b\\d{16}\\b",
    "emailAddress": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:\\.[A-Za-z]{2,})?\\b"
  }
}
```
When entering information in the UI, use single slash (/) instead of double slash (//). Double slash is only for Postman testing because of formatting issues.

Note: The application uses a regular expression to detect PII data based on the specified file extensions and regular expressions. Since we are using Gemini API to autopopulate or fill in the UI, it will not have remember or store any regex pairs or patterns (in your clipboard) required for the scanning purpose.
