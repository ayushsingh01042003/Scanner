import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GenReport from './Pages/ReportsPage/ReportsPage';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="reports" element={<GenReport />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
