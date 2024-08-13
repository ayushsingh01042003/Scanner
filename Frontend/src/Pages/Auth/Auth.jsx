import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './Login';
import Signup from './Signup';



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
    <>
    <div className='bg-black mb-10 w-full flex justify-center'>
      {activeComponent === 'signup' && <Signup setActiveComponent={setActiveComponent} />}
      {activeComponent === 'login' && <Login setActiveComponent={setActiveComponent} onLogin={handleLogin} />}
    </div>
    </>
  );
};

export default Auth;
