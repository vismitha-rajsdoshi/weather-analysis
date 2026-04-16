import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, History, TrendingUp, CloudRain } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/History';
import PredictionPage from './pages/Prediction';
import CitySearch from './components/CitySearch';
import { LocationProvider } from './context/LocationContext';
import './index.css';

function Sidebar() {
  return (
    <div className="sidebar relative z-10 glass-panel">
      <div className="sidebar-header">
        <h2>
             <span style={{ fontSize: '1.8rem' }}>⛅</span> 
             Weather<span className="text-gradient">Sense</span>
        </h2>
      </div>
      
      <CitySearch />

      <div className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <History size={20} />
            <span>History</span>
          </NavLink>
          <NavLink to="/prediction" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <TrendingUp size={20} />
            <span>Forecast</span>
          </NavLink>
      </div>
    </div>
  );
}

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;
