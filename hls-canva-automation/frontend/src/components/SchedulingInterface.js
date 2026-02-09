import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SchedulingInterface.css';

function SchedulingInterface() {
  const [designs, setDesigns] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    designId: '',
    platform: 'instagram',
    scheduleType: 'once',
    scheduleTime: '09:00',
    scheduleDay: 'monday',
    timezone: 'UTC'
  });
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [designsRes, schedulesRes] = await Promise.all([
        axios.get('/api/designs'),
        axios.get('/api/schedules')
      ]);
      setDesigns(designsRes.data.designs || []);
      setSchedules(schedulesRes.data.schedules || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const schedulePayload = {
        designId: formData.designId,
        platform: formData.platform,
        schedule: {
          type: formData.scheduleType,
          time: formData.scheduleTime,
          day: formData.scheduleType === 'weekly' ? formData.scheduleDay : undefined
        },
        timezone: formData.timezone
      };

      if (editingSchedule) {
        await axios.put(`/api/schedules/${editingSchedule.id}`, schedulePayload);
        setEditingSchedule(null);
      } else {
        await axios.post('/api/schedules', schedulePayload);
      }

      // Reset form
      setFormData({
        designId: '',
        platform: 'instagram',
        scheduleType: 'once',
        scheduleTime: '09:00',
        scheduleDay: 'monday',
        timezone: 'UTC'
      });

      // Refresh schedules
      await fetchData();
    } catch (err) {
      setError('Failed to save schedule');
      console.error(err);
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      designId: schedule.designId,
      platform: schedule.platform,
      scheduleType: schedule.schedule.type,
      scheduleTime: schedule.schedule.time,
      scheduleDay: schedule.schedule.day || 'monday',
      timezone: schedule.timezone
    });
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`/api/schedules/${scheduleId}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete schedule');
        console.error(err);
      }
    }
  };

  const getDesignTitle = (designId) => {
    const design = designs.find(d => d.id === designId);
    return design ? design.title : 'Unknown Design';
  };

  if (loading) {
    return <div className="loading">Loading scheduling interface...</div>;
  }

  return (
    <div className="scheduling-interface">
      <h2 className="section-title">📅 Scheduling Interface</h2>

      {error && <div className="error">{error}</div>}

      <div className="scheduling-grid">
        {/* Schedule Form */}
        <div className="card schedule-form-card">
          <h3>{editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}</h3>
          
          {designs.length === 0 ? (
            <p style={{ color: '#999' }}>
              No designs available. <a href="#designs">Pull designs from Canva first</a>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-group">
                <label htmlFor="designId">Select Design *</label>
                <select
                  id="designId"
                  name="designId"
                  value={formData.designId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Choose a design --</option>
                  {designs.map(design => (
                    <option key={design.id} value={design.id}>
                      {design.title} ({design.format})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="platform">Publishing Platform *</label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                >
                  <option value="instagram">📱 Instagram (@hellolittlesleepers)</option>
                  <option value="email">📧 Email Newsletter</option>
                  <option value="facebook">👍 Facebook</option>
                  <option value="twitter">𝕏 Twitter/X</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="scheduleType">Schedule Type *</label>
                <select
                  id="scheduleType"
                  name="scheduleType"
                  value={formData.scheduleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="scheduleTime">Post Time (HH:MM) *</label>
                <input
                  type="time"
                  id="scheduleTime"
                  name="scheduleTime"
                  value={formData.scheduleTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {formData.scheduleType === 'weekly' && (
                <div className="form-group">
                  <label htmlFor="scheduleDay">Day of Week</label>
                  <select
                    id="scheduleDay"
                    name="scheduleDay"
                    value={formData.scheduleDay}
                    onChange={handleInputChange}
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="timezone">Timezone *</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  required
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Australia/Brisbane">Australia/Brisbane</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="button button-primary">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </button>
                {editingSchedule && (
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      setEditingSchedule(null);
                      setFormData({
                        designId: '',
                        platform: 'instagram',
                        scheduleType: 'once',
                        scheduleTime: '09:00',
                        scheduleDay: 'monday',
                        timezone: 'UTC'
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Schedules List */}
        <div className="card schedules-list-card">
          <h3>📋 Scheduled Posts ({schedules.length})</h3>
          
          {schedules.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
              No schedules created yet
            </p>
          ) : (
            <div className="schedules-list">
              {schedules.map(schedule => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-item-header">
                    <h4>{getDesignTitle(schedule.designId)}</h4>
                    <span className={`status-badge ${schedule.status}`}>
                      {schedule.status}
                    </span>
                  </div>
                  
                  <div className="schedule-item-details">
                    <div className="detail-row">
                      <strong>Platform:</strong>
                      <span>{schedule.platform}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Schedule:</strong>
                      <span>
                        {schedule.schedule.type}
                        {schedule.schedule.type === 'weekly' && ` - ${schedule.schedule.day}`}
                        {' at '}
                        {schedule.schedule.time}
                      </span>
                    </div>
                    <div className="detail-row">
                      <strong>Timezone:</strong>
                      <span>{schedule.timezone}</span>
                    </div>
                  </div>

                  <div className="schedule-item-actions">
                    <button
                      className="button button-secondary button-sm"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-danger button-sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SchedulingInterface;
