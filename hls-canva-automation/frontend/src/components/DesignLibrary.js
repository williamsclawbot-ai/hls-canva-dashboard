import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DesignLibrary.css';

function DesignLibrary() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [filterFormat, setFilterFormat] = useState('all');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/designs');
      setDesigns(response.data.designs || []);
    } catch (err) {
      setError('Failed to fetch designs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pullFromCanva = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/canva/designs');
      setDesigns(response.data.designs || []);
    } catch (err) {
      setError('Failed to pull designs from Canva. Make sure credentials are configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportForEmail = async (designId, format = 'png') => {
    try {
      const response = await axios.post('/api/export/email', {
        designId,
        format
      });
      alert(`Export ready! Format: ${response.data.format}`);
    } catch (err) {
      alert('Failed to export design');
      console.error(err);
    }
  };

  const publishToInstagram = async (designId) => {
    try {
      const response = await axios.post('/api/publish/instagram', {
        designId,
        caption: 'New design from Hello Little Sleepers'
      });
      if (response.data.error) {
        alert('Note: ' + response.data.error);
      } else {
        alert('Design published to Instagram!');
      }
    } catch (err) {
      alert('Failed to publish to Instagram');
      console.error(err);
    }
  };

  const filteredDesigns = filterFormat === 'all' 
    ? designs 
    : designs.filter(d => d.format === filterFormat);

  return (
    <div className="design-library">
      <h2 className="section-title">🎨 Design Library</h2>

      {error && <div className="error">{error}</div>}

      {/* Controls */}
      <div className="library-controls">
        <div className="control-group">
          <button 
            className="button button-primary"
            onClick={pullFromCanva}
            disabled={loading}
          >
            {loading ? 'Loading...' : '📥 Pull Designs from Canva'}
          </button>
        </div>

        <div className="control-group">
          <label htmlFor="format-filter">Filter by Format:</label>
          <select 
            id="format-filter"
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
          >
            <option value="all">All Formats</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div className="control-group">
          <p className="design-count">
            {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Designs Grid */}
      {loading && <div className="loading">Fetching designs...</div>}

      {!loading && filteredDesigns.length === 0 && (
        <div className="empty-state">
          <p>No designs found.</p>
          <button 
            className="button button-primary"
            onClick={pullFromCanva}
          >
            Pull Designs from Canva
          </button>
        </div>
      )}

      {!loading && filteredDesigns.length > 0 && (
        <div className="design-grid">
          {filteredDesigns.map((design) => (
            <div 
              key={design.id} 
              className={`design-card ${selectedDesign?.id === design.id ? 'selected' : ''}`}
              onClick={() => setSelectedDesign(design)}
            >
              <div className="design-card-image">
                <img src={design.thumbnail} alt={design.title} />
                <div className="design-overlay">
                  <button 
                    className="button button-primary button-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      publishToInstagram(design.id);
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>
              <div className="design-card-content">
                <h4>{design.title}</h4>
                <p>{design.description}</p>
                <div className="design-card-meta">
                  <span className="format-badge">{design.format}</span>
                  <span className="status-badge">{design.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail View */}
      {selectedDesign && (
        <div className="design-detail-modal" onClick={() => setSelectedDesign(null)}>
          <div className="design-detail-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button"
              onClick={() => setSelectedDesign(null)}
            >
              ✕
            </button>
            
            <div className="detail-grid">
              <div className="detail-image">
                <img src={selectedDesign.thumbnail} alt={selectedDesign.title} />
              </div>
              
              <div className="detail-info">
                <h2>{selectedDesign.title}</h2>
                <p className="detail-description">{selectedDesign.description}</p>
                
                <div className="detail-meta">
                  <div className="meta-item">
                    <strong>Format:</strong> {selectedDesign.format}
                  </div>
                  <div className="meta-item">
                    <strong>Status:</strong> <span className="status-badge">{selectedDesign.status}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Created:</strong> {new Date(selectedDesign.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="detail-actions">
                  <button 
                    className="button button-primary"
                    onClick={() => publishToInstagram(selectedDesign.id)}
                  >
                    📱 Post to Instagram
                  </button>
                  <button 
                    className="button button-secondary"
                    onClick={() => exportForEmail(selectedDesign.id, 'png')}
                  >
                    📧 Export as PNG
                  </button>
                  <button 
                    className="button button-secondary"
                    onClick={() => exportForEmail(selectedDesign.id, 'pdf')}
                  >
                    📄 Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignLibrary;
