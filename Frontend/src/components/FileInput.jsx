import React, { useState } from 'react';

const FileInput = ({ onExtensionsChange }) => {
  const [extensions, setExtensions] = useState('');

  const handleInputChange = (event) => {
    const input = event.target.value;
    setExtensions(input);
    const extensionArray = input.split(',').map(ext => ext.trim());
    onExtensionsChange(extensionArray);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">File Extensions</label>
      <input
        type="text"
        value={extensions}
        onChange={handleInputChange}
        placeholder="Enter file extensions separated by commas (e.g., .java, .py)"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
};

export default FileInput;
