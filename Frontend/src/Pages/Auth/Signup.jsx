// src/Pages/Signup/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:3000/signup', { username, password, confirmPassword }, { withCredentials: true });
      setMessage('Signup successful');
    } catch (error) {
      setMessage(error.response.data.msg);
    }
  };

  return (
    <div className="p-5 border rounded-lg shadow-lg w-80">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mt-1 rounded"
            required
          />
        </label>
        <label className="mb-2">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mt-1 rounded"
            required
          />
        </label>
        <label className="mb-2">
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 mt-1 rounded"
            required
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
          Signup
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
