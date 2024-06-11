import React from 'react';

const ResponseMessage = ({ response }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-gray-700">Response from Server</h2>
    <pre className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4 overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
  </div>
);

export default ResponseMessage;
