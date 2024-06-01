import React, { useState } from 'react';
import FileInput from './components/FileInput';
import KeyValueInput from './components/KeyValueInput';
import './index.css';

const App = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [extensions, setExtensions] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState({});
  const [response, setResponse] = useState(null);

  const handleExtensionsChange = (extensionArray) => {
    setExtensions(extensionArray);
  };

  const handleKeyValuePairsChange = (pairs) => {
    const formattedPairs = pairs.reduce((acc, pair) => {
      if (pair.key && pair.value) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {});
    setKeyValuePairs(formattedPairs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!owner || !repo || extensions.length === 0 || Object.keys(keyValuePairs).length === 0) {
      alert('Please provide all the required inputs.');
      return;
    }

    const payload = {
      owner,
      repo,
      fileExtensions: extensions,
      regexPairs: keyValuePairs
    };

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Upload Details</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Owner Name</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter GitHub owner name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repo Name</label>
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Enter GitHub repo name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <FileInput onExtensionsChange={handleExtensionsChange} />
        <KeyValueInput onKeyValuePairsChange={handleKeyValuePairsChange} />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none">
          Submit
        </button>
      </form>
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700">Response</h3>
          <pre className="bg-gray-100 p-4 rounded-lg shadow-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
