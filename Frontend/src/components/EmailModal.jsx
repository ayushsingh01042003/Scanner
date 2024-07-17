import React from 'react';

const EmailModal = ({ isOpen, onClose, email, setEmail, onSend }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="h-[220px] w-1/2 bg-[#2C2D2F] p-6 rounded-lg">
        <h2 className="text-xl mb-4 text-white">Enter email address</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-[50px] w-full py-4 px-4 mb-4 bg-[#1C1C1C] text-white rounded-xl focus:outline-none"
          placeholder="Enter email address"
        />
        <div className="flex justify-end">
          <button
            className="w-[180px] mr-4 p-3 bg-gray-500 text-white rounded hover:bg-black hover:text-white rounded-lg transition duration-300 font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-[180px] mr-4 p-2 bg-[#a4ff9e] text-black rounded hover:bg-black hover:text-[#a4ff9e] rounded-lg transition duriation-300 font-bold"
            onClick={onSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;