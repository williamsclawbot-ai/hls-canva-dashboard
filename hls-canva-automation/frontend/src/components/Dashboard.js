import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh dashboard every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/dashboard');
      setDashboard(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="error">{error}</div>
        <button className="button button-primary" onClick={fetchDashboardData}>
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="loading">No data available</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="section-title">📊 Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{dashboard.stats.totalDesigns}</div>
          <div className="stat-label">Total Designs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboard.stats.totalScheduled}</div>
          <div className="stat-label">Scheduled Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboard.stats.totalPublished}</div>
          <div className="stat-label">Published Posts</div>
        </div>
      </div>

      {/* Recent Designs */}
      <div className="card">
        <h3>🎨 Recent Designs</h3>
        {dashboard.recentDesigns.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
            No designs yet. <a href="#designs">Pull designs from Canva</a>
          </p>
        ) : (
          <div className="design-list">
            {dashboard.recentDesigns.map((design) => (
              <div key={design.id} className="design-item">
                <img src={design.thumbnail} alt={design.title} className="design-thumbnail" />
                <div className="design-info">
                  <h4>{design.title}</h4>
                  <p>{design.description}</p>
                  <div className="design-meta">
                    <span className="badge">{design.format}</span>
                    <span className="date">{new Date(design.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled Posts */}
      <div className="card">
        <h3>📅 Upcoming Scheduled Posts</h3>
        {dashboard.scheduledPosts.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
            No scheduled posts. <a href="#scheduling">Create a schedule</a>
          </p>
        ) : (
          <div className="schedule-list">
            {dashboard.scheduledPosts.map((schedule) => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-info">
                  <strong>{schedule.platform.toUpperCase()}</strong>
                  <p>Schedule: {schedule.schedule.type}</p>
                  <p>Status: <span className="status-badge scheduled">{schedule.status}</span></p>
                </div>
                <small>{new Date(schedule.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publishing History */}
      <div className="card">
        <h3>📜 Recent Publishing History</h3>
        {dashboard.publishingHistory.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
            No publishing history yet.
          </p>
        ) : (
          <div className="history-list">
            {dashboard.publishingHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-platform">{item.platform}</div>
                <div className="history-status">
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                </div>
                <div className="history-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3>Getting Started</h3>
        <div className="cta-buttons">
          <a href="#designs" className="button button-primary">
            Pull Designs from Canva
          </a>
          <a href="#scheduling" className="button button-secondary">
            Create a Schedule
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
