import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Pages/Auth/AuthContext';
import Layout from './components/Layout';
import ReportsPage from './Pages/Reports/ReportsPage';
import Overview from './Pages/Overview/Overview';
import Auth from './Pages/Auth/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const [clientId, setClientId] = useState('');

  useEffect(() =>{
    fetch('http://localhost:3000/google-client-id')
    .then((response) => response.json())
    .then((data) => setClientId(data.clientId))
    .catch((error) => console.error('Error fetching Google Client ID:', error));
  },[]);

  return (
    clientId && (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Auth />} /> 
            <Route path='/home' element={<Layout />}>
              <Route path='overview' element={<ProtectedRoute element={<Overview />} />} />
              <Route path='reports' element={<ProtectedRoute element={<ReportsPage />} />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
    )
  );
};

export default App;
