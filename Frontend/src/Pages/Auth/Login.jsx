// src/Pages/Login/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(username, password);
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="p-5 border rounded-lg shadow-lg w-80">
      <h2 className="text-2xl mb-4">Login</h2>
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
        <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Login;
