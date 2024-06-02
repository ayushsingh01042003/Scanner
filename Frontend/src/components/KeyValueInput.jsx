import React, { useState } from 'react';

const KeyValueInput = ({ onKeyValuePairsChange }) => {
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '' }]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index][name] = value;
    setKeyValuePairs(newKeyValuePairs);
    onKeyValuePairsChange(newKeyValuePairs);
  };

  const handleAddPair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  const handleRemovePair = (index) => {
    const newKeyValuePairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(newKeyValuePairs);
    onKeyValuePairsChange(newKeyValuePairs);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Key-Value Pairs</h3>
      {keyValuePairs.map((pair, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            name="key"
            value={pair.key}
            onChange={(event) => handleChange(index, event)}
            placeholder="Key"
            className="block w-1/2 px-3 py-2 mr-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            type="text"
            name="value"
            value={pair.value}
            onChange={(event) => handleChange(index, event)}
            placeholder="Value"
            className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {keyValuePairs.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemovePair(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddPair}
        className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
      >
        Add Key-Value Pair
      </button>
    </div>
  );
};

export default KeyValueInput;
