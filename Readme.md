Input template backend:

For /scan-github route

{
  "owner": "ayushsingh01042003",
  "repo": "DSA", 
  "regexPairs": {
    "ssn": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
    "creditCard": "\\b\\d{16}\\b",
    "emailAddress": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:\\.[A-Za-z]{2,})?\\b"
  },
  "fileExtensions": ["java"]
}


For /scan-directory route

{
  "directoryPath": "/home/ayush/Progs/Cognizant/codebase",
  "extensionArray": [".java", ".py", ".js"],
  "regexPairs": {
    "ssn": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
    "creditCard": "\\b\\d{16}\\b",
    "emailAddress": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:\\.[A-Za-z]{2,})?\\b"
  }
}