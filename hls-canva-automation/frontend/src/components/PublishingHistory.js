import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublishingHistory.css';

function PublishingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/history');
      setHistory(response.data.history || []);
    } catch (err) {
      setError('Failed to fetch publishing history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const platformMatch = filterPlatform === 'all' || item.platform === filterPlatform;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return platformMatch && statusMatch;
  });

  const stats = {
    total: history.length,
    published: history.filter(h => h.status === 'published').length,
    pending: history.filter(h => h.status === 'pending').length,
    failed: history.filter(h => h.status === 'failed').length,
  };

  if (loading) {
    return <div className="loading">Loading publishing history...</div>;
  }

  return (
    <div className="publishing-history">
      <h2 className="section-title">📜 Publishing History</h2>

      {error && <div className="error">{error}</div>}

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-box">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-box published">
          <div className="stat-number">{stats.published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-box pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-box failed">
          <div className="stat-number">{stats.failed}</div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="history-filters">
          <div className="filter-group">
            <label htmlFor="platform-filter">Platform:</label>
            <select
              id="platform-filter"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="instagram">📱 Instagram</option>
              <option value="email">📧 Email</option>
              <option value="facebook">👍 Facebook</option>
              <option value="twitter">𝕏 Twitter</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">✅ Published</option>
              <option value="pending">⏳ Pending</option>
              <option value="failed">❌ Failed</option>
            </select>
          </div>

          <button
            className="button button-secondary"
            onClick={fetchHistory}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="card">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <p>No publishing history found for the selected filters.</p>
            <button
              className="button button-primary"
              onClick={fetchHistory}
            >
              Refresh History
            </button>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} className={`status-${item.status}`}>
                    <td className="date-cell">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="platform-cell">
                      <span className="platform-badge">
                        {item.platform.toUpperCase()}
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={`status-indicator ${item.status}`}>
                        {item.status === 'published' && '✅'}
                        {item.status === 'pending' && '⏳'}
                        {item.status === 'failed' && '❌'}
                        {' '}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="message-cell">
                      {item.caption || item.error || '-'}
                    </td>
                    <td className="actions-cell">
                      {item.status === 'failed' && (
                        <button className="button button-sm button-secondary">
                          Retry
                        </button>
                      )}
                      {item.status === 'published' && (
                        <a
                          href={item.publishUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button button-sm button-secondary"
                        >
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="card">
        <h3>📥 Export Data</h3>
        <p>Export your publishing history as CSV or JSON for analysis and records.</p>
        <div className="export-buttons">
          <button className="button button-secondary">
            📊 Export as CSV
          </button>
          <button className="button button-secondary">
            📄 Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishingHistory;
