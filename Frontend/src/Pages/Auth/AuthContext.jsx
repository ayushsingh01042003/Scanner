import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('jwt');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/user', { withCredentials: true });
        setIsAuthenticated(true);
        setUsername(response.data.username);
        setAccountType(response.data.accountType);
      } catch (error) {
        setIsAuthenticated(false);
        setUsername('');
        setAccountType('');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try{
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg );
      }
      console.log(accountType);
  
    setIsAuthenticated(true);
    setUsername(username);
    setAccountType(data.accountType);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated, username, setUsername, loading, login ,logout, accountType, setAccountType }}>
      {children}
    </AuthContext.Provider>
  );
};
