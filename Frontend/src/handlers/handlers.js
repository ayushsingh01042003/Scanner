export const handleSubmit = async (
  event,
  owner,
  repo,
  extensions,
  keyValuePairs,
  setFormError,
  setLoading,
  setResponse
) => {
  event.preventDefault();
  if (!owner || !repo || extensions.length === 0 || keyValuePairs.length === 0) {
    setFormError('Please provide all the required inputs.');
    return;
  }

  const payload = {
    owner,
    repo,
    fileExtensions: extensions,
    regexPairs: keyValuePairs.reduce((acc, pair) => {
      if (pair.key && pair.value) acc[pair.key] = pair.value;
      return acc;
    }, {})
  };

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

export const handleClear = (
  setOwner,
  setRepo,
  setExtensions,
  setKeyValuePairs,
  setGeneratedJSON,
  setFormError,
  setResponse
) => {
  setOwner('');
  setRepo('');
  setExtensions([]);
  setKeyValuePairs([]);
  setGeneratedJSON(null);
  setFormError('');
  setResponse(null);
};
