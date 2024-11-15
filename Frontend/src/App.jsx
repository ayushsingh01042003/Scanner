import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Pages/Auth/AuthContext';
import Layout from './components/Layout';
import ReportsPage from './Pages/Reports/ReportsPage';
import Overview from './Pages/Overview/Overview';
import Auth from './Pages/Auth/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import AddTeamMember from './Pages/Overview/AddTeamMembers';
import ReportAdmin from './Pages/Reports/ReportAdmin'
import ReportsPageTeam from './Pages/Reports/ReportDetailsTeam';

const App = () => {
  const [clientId, setClientId] = useState('');

  return (
    (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Auth />} />
            <Route path='/home' element={<Layout />}>
              <Route path='overview' element={<ProtectedRoute element={<Overview />} />} />
              <Route path='reports' element={<ProtectedRoute element={<ReportsPage />} />} />
              <Route path='reportsteam' element={<ProtectedRoute element={<ReportsPageTeam />} />} />
              <Route path='addteammembers' element={<ProtectedRoute element={<AddTeamMember />}/>}/>
              <Route path='adminreports' element={<ProtectedRoute element={<ReportAdmin/>}/>}/>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    )
  );
};

export default App;
