import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scenarios from './pages/Scenarios';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Sidebar />
      <div className="page-container">
        <header className="top-bar">
          <div className="sys-status">
            <span className="status-indicator active"></span>
            SYS.ONLINE
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
