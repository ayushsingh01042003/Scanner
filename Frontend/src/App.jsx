import React, { useState } from 'react';
import FileInput from './components/FileInput';
import KeyValueInput from './components/KeyValueInput';
import Accordion from './components/Accordion';
import './index.css';

const App = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [extensions, setExtensions] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState([]);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleExtensionsChange = (extensionArray) => setExtensions(extensionArray);
  const handleKeyValuePairsChange = (pairs) => setKeyValuePairs(pairs);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!owner || !repo || extensions.length === 0 || keyValuePairs.length === 0) {
      setFormError('Please provide all the required inputs.');
      return;
    }

    const payload = {
      owner,
      repo,
      regexPairs: keyValuePairs.reduce((acc, pair) => {
        if (pair.key && pair.value) acc[pair.key] = pair.value;
        return acc;
      }, {}),
      fileExtensions: extensions
    };

    console.log(payload)

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/scan-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setResponse(await response.json());
    } catch (error) {
      console.error('Error:', error);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOwner('');
    setRepo('');
    setExtensions([]);
    setKeyValuePairs([]);
    setGeneratedJSON(null);
    setFormError('');
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">Data Upload</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="GitHub Owner Name"
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter GitHub owner name"
          />
          <TextInput
            label="GitHub Repo Name"
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Enter GitHub repo name"
          />
          <Accordion title="File Extensions">
            <FileInput onExtensionsChange={handleExtensionsChange} />
          </Accordion>
          <Accordion title="Key-Value Pairs">
            <KeyValueInput onKeyValuePairsChange={handleKeyValuePairsChange} />
          </Accordion>
          <ButtonRow onSubmit={handleSubmit} onClear={handleClear} isLoading={loading} />
          {formError && <ErrorMessage message={formError} />}
        </form>
        {loading && <LoadingMessage />}
        {response && <ResponseMessage response={response} />}
      </div>
    </div>
  );
};

const TextInput = ({ label, id, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
    />
  </div>
);

const ButtonRow = ({ onSubmit, onClear, isLoading }) => (
  <div className="flex justify-between items-center">
    <button type="submit" className="w-32 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none text-lg">
      Submit
    </button>
    <div className="flex space-x-4">
      <button type="button" onClick={onClear} className="text-gray-700 hover:text-red-500 focus:outline-none text-lg">
        Clear
      </button>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-lg mt-2">{message}</p>
);

const LoadingMessage = () => (
  <p className="text-lg font-semibold text-gray-700 mt-4">Loading...</p>
);

const ResponseMessage = ({ response }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-gray-700">Response from Server</h2>
    <pre className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4 overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
  </div>
);

export default App;
