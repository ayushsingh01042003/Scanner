import React from 'react';

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded-lg h-4 w-4 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-blue-600"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
