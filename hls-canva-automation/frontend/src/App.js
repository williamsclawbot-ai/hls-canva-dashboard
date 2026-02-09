import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DesignLibrary from './components/DesignLibrary';
import SchedulingInterface from './components/SchedulingInterface';
import PublishingHistory from './components/PublishingHistory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify backend is running
    fetch('/api/health')
      .catch(error => console.warn('Backend not available:', error));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-section">
          <h1>🌙 Hello Little Sleepers</h1>
          <p>Design Automation & Publishing Platform</p>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'designs' ? 'active' : ''}`}
          onClick={() => setActiveTab('designs')}
        >
          🎨 Design Library
        </button>
        <button 
          className={`nav-button ${activeTab === 'scheduling' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduling')}
        >
          📅 Scheduling
        </button>
        <button 
          className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Publishing History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'designs' && <DesignLibrary />}
        {activeTab === 'scheduling' && <SchedulingInterface />}
        {activeTab === 'history' && <PublishingHistory />}
      </main>

      <footer className="app-footer">
        <p>Hello Little Sleepers © 2024 | Design Automation Platform v1.0</p>
      </footer>
    </div>
  );
}

export default App;
