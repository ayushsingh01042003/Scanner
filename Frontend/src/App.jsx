import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './Pages/Overview/Overview';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="overview" element={<Overview/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;