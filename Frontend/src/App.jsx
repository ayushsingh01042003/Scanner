import React, { useState } from 'react';
import FormContainer from './components/FormContainer';
import './index.css';

const App = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [extensions, setExtensions] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState([]);
  const [generatedJSON, setGeneratedJSON] = useState(null);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">Data Upload</h1>
        <FormContainer
          owner={owner}
          setOwner={setOwner}
          repo={repo}
          setRepo={setRepo}
          extensions={extensions}
          setExtensions={setExtensions}
          keyValuePairs={keyValuePairs}
          setKeyValuePairs={setKeyValuePairs}
          formError={formError}
          setFormError={setFormError}
          loading={loading}
          setLoading={setLoading}
          response={response}
          setResponse={setResponse}
          setGeneratedJSON={setGeneratedJSON}
        />
      </div>
    </div>
  );
};

export default App;
