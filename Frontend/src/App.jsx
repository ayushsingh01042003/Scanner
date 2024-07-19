import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Pages/Auth/AuthContext';
import Layout from './components/Layout';
import ReportsPage from './Pages/Reports/ReportsPage';
import Overview from './Pages/Overview/Overview';
import Auth from './Pages/Auth/Auth';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/Auth' element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route path="overview" element={<ProtectedRoute element={<Overview />} />} />
            <Route path="reports" element={<ProtectedRoute element={<ReportsPage />} />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
