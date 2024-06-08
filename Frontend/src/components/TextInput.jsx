import React from 'react';

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

export default TextInput;
