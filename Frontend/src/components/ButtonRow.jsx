import React from 'react';

const ButtonRow = ({ isLoading, onClear }) => (
  <div className="flex justify-between items-center">
    <button type="submit" className="w-32 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none text-lg">
      {isLoading ? 'Loading...' : 'Submit'}
    </button>
    <div className="flex space-x-4">
      <button type="button" onClick={onClear} className="text-gray-700 hover:text-red-500 focus:outline-none text-lg">
        Clear
      </button>
    </div>
  </div>
);

export default ButtonRow;
