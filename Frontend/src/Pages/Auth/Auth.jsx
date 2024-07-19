import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Signup from './Signup';
import Login from './Login';

const Auth = () => {
  const [activeComponent, setActiveComponent] = useState('login');
  const { isAuthenticated, login } = useContext(AuthContext);

  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/home" />; 
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="mb-5">
        <button
          onClick={() => setActiveComponent('signup')}
          className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
        >
          Signup
        </button>
        <button
          onClick={() => setActiveComponent('login')}
          className="bg-green-500 text-white px-4 py-2 m-2 rounded"
        >
          Login
        </button>
      </div>
      <div className="w-full flex justify-center">
        {activeComponent === 'signup' && <Signup />}
        {activeComponent === 'login' && <Login onLogin={handleLogin} />}
      </div>
    </div>
  );
};

export default Auth;
