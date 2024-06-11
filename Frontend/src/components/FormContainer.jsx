import React from 'react';
import TextInput from './TextInput';
import ButtonRow from './ButtonRow';
import ErrorMessage from './ErrorMessage';
import LoadingMessage from './LoadingMessage';
import ResponseMessage from './ResponseMessage';
import Accordion from './Accordion';
import FileInput from './FileInput';
import KeyValueInput from './KeyValueInput';
import { handleSubmit, handleClear } from '../handlers/handlers';

const FormContainer = ({
  owner,
  setOwner,
  repo,
  setRepo,
  extensions,
  setExtensions,
  keyValuePairs,
  setKeyValuePairs,
  formError,
  setFormError,
  loading,
  setLoading,
  response,
  setResponse,
  setGeneratedJSON
}) => {
  const handleExtensionsChange = (extensionArray) => setExtensions(extensionArray);
  const handleKeyValuePairsChange = (pairs) => setKeyValuePairs(pairs);

  return (
    <>
      <form
        onSubmit={(event) =>
          handleSubmit(
            event,
            owner,
            repo,
            extensions,
            keyValuePairs,
            setFormError,
            setLoading,
            setResponse
          )
        }
        className="space-y-6"
      >
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
        <ButtonRow
          onClear={() =>
            handleClear(
              setOwner,
              setRepo,
              setExtensions,
              setKeyValuePairs,
              setGeneratedJSON,
              setFormError,
              setResponse
            )
          }
          isLoading={loading}
        />
        {formError && <ErrorMessage message={formError} />}
      </form>
      {loading && <LoadingMessage />}
      {response && <ResponseMessage response={response} />}
    </>
  );
};

export default FormContainer;
