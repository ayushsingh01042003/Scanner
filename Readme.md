# Scanner
  


  ## Description 📝

  This application can be useful for identifying potential PII vulnerabilities in code repositories or local directories, which is important for maintaining data privacy and security.

  ## Table of Contents 🗒

  * [Installations](#installations-)

  * [Usage](#usage-)
  
  * [Contributors](#contributors-)

  * [Test](#tests-)

  * [Questions](#questions-)

  * [Example](#Example-)

  
  
  ## Installations 💻

  To install dependencies, run these commands:

  ```
  For Frontend dependencies are:
  i> @vitejs/plugin-react 
  ii> eslint
  iii> tailwindcss
  iv> vite 
  are to be installed. 

  For Backend:
  i> cors
  ii> dotenv
  iii> express
  iV> octokit 
  as dependencies.
  ```

  ## Usage 🏆

  the proper usage of this repository involves the following steps:

  i> Install dependencies (npm install or yarn install)
  ii> Set up a GitHub access token as an environment variable (GITHUB_TOKEN)
  iii> Start the development server (npm run dev or yarn dev)
  iv> Access the application in your browser (usually http://localhost:3000)
  v> Enter the GitHub owner, repository name, file extensions, and regular expressions for PII detection
  vi> Click "Submit" to initiate the scan
  vii> View the scan results in the formatted JSON response
  viii> Optionally, clear the form using the "Clear" button or modify the key-value pairs for PII detection
  ix> Build for production using npm run build or yarn build
  
  The application provides a user interface for scanning public GitHub repositories for potential PII vulnerabilities based on the specified file extensions and regular expressions.

  

  ## Contributors 😃

  @ayushsingh01042003 , @MckinellGreen7 , @smk927 , @Cobal9000 

  ## Tests 🧪

  To run tests, run these commands:

  ```
  node index.js in the Backend folder and in the Frontend folder run "npm run dev" on their respective integrated terminals
  ```

  ## Questions ❔

  For additional questions, contact me at the email provided below. 

  - GitHub: [Cobalt9000](https://github.com/Cobalt9000/)
  - Email:  suprith1201@gmail.com

  ## Example 📋

  the example key-value pair for the regexPairs and patterns are below: 

  Input template backend:

  i> For /scan-github route

  { "owner": "ayushsingh01042003", "repo": "DSA", "regexPairs": { "ssn": "\b\d{3}-\d{2}-\d{4}\b", "creditCard": "\b\d{16}\b", "emailAddress": "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?\b" }, "fileExtensions": ["java"] }

  ii> For /scan-directory route

  { "directoryPath": "/home/ayush/Progs/Cognizant/codebase", "extensionArray": [".java", ".py", ".js"], "regexPairs": { "ssn": "\b\d{3}-\d{2}-\d{4}\b", "creditCard": "\b\d{16}\b", "emailAddress": "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?\b" } }

  When Entering information in the UI. Use single slash -> / instead of double slash -> // Double slash is only for postman testing because of formatting issues.