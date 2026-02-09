require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration
const CANVA_API_BASE = 'https://api.canva.com';
const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID;
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET;

// Data storage paths
const dataDir = path.join(__dirname, '..', 'data');
const designsFile = path.join(dataDir, 'designs.json');
const schedulesFile = path.join(dataDir, 'schedules.json');
const historyFile = path.join(dataDir, 'history.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files
const initializeDataFiles = () => {
  if (!fs.existsSync(designsFile)) {
    fs.writeFileSync(designsFile, JSON.stringify({ designs: [], lastUpdated: new Date().toISOString() }));
  }
  if (!fs.existsSync(schedulesFile)) {
    fs.writeFileSync(schedulesFile, JSON.stringify({ schedules: [] }));
  }
  if (!fs.existsSync(historyFile)) {
    fs.writeFileSync(historyFile, JSON.stringify({ history: [] }));
  }
};

initializeDataFiles();

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HLS Canva Automation API' });
});

// Get Canva designs from Jade's account
app.get('/api/canva/designs', async (req, res) => {
  try {
    // In a real implementation, this would use OAuth token from Jade's authenticated session
    // For now, we'll use the client credentials to fetch designs
    
    console.log('Fetching designs from Canva API...');
    
    // Mock response - in production, this would call Canva's actual API
    // The Canva API requires proper OAuth authentication with Jade's account
    const designs = {
      designs: [
        {
          id: uuidv4(),
          title: "Baby Sleep Schedule Template",
          description: "Downloadable sleep schedule for parents",
          thumbnail: "https://via.placeholder.com/600x400?text=Sleep+Schedule",
          designUrl: "https://www.canva.com/design/example1",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready",
          format: "instagram"
        },
        {
          id: uuidv4(),
          title: "Bedtime Routine Tips",
          description: "Instagram carousel post about bedtime routines",
          thumbnail: "https://via.placeholder.com/600x400?text=Bedtime+Tips",
          designUrl: "https://www.canva.com/design/example2",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready",
          format: "instagram"
        },
        {
          id: uuidv4(),
          title: "Weekly Newsletter",
          description: "Email newsletter template for parents",
          thumbnail: "https://via.placeholder.com/600x400?text=Newsletter",
          designUrl: "https://www.canva.com/design/example3",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ready",
          format: "email"
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    // Save to local storage
    writeData(designsFile, designs);
    
    res.json(designs);
  } catch (error) {
    console.error('Error fetching Canva designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs', details: error.message });
  }
});

// Get cached designs
app.get('/api/designs', (req, res) => {
  const data = readData(designsFile);
  if (data) {
    res.json(data);
  } else {
    res.json({ designs: [], lastUpdated: new Date().toISOString() });
  }
});

// Get design details
app.get('/api/designs/:id', (req, res) => {
  const data = readData(designsFile);
  if (data) {
    const design = data.designs.find(d => d.id === req.params.id);
    if (design) {
      res.json(design);
    } else {
      res.status(404).json({ error: 'Design not found' });
    }
  } else {
    res.status(404).json({ error: 'Design not found' });
  }
});

// Create scheduled post
app.post('/api/schedules', (req, res) => {
  try {
    const { designId, platform, schedule, timezone } = req.body;
    
    if (!designId || !platform || !schedule) {
      return res.status(400).json({ error: 'Missing required fields: designId, platform, schedule' });
    }
    
    const scheduleRecord = {
      id: uuidv4(),
      designId,
      platform,
      schedule, // { type: 'once' | 'daily' | 'weekly', time: '09:00', day?: 'monday' }
      timezone: timezone || 'UTC',
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    
    const data = readData(schedulesFile) || { schedules: [] };
    data.schedules.push(scheduleRecord);
    writeData(schedulesFile, data);
    
    res.json(scheduleRecord);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule', details: error.message });
  }
});

// Get all schedules
app.get('/api/schedules', (req, res) => {
  const data = readData(schedulesFile);
  if (data) {
    res.json(data);
  } else {
    res.json({ schedules: [] });
  }
});

// Get schedule by ID
app.get('/api/schedules/:id', (req, res) => {
  const data = readData(schedulesFile);
  if (data) {
    const schedule = data.schedules.find(s => s.id === req.params.id);
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ error: 'Schedule not found' });
    }
  } else {
    res.status(404).json({ error: 'Schedule not found' });
  }
});

// Update schedule
app.put('/api/schedules/:id', (req, res) => {
  try {
    const data = readData(schedulesFile);
    const schedule = data.schedules.find(s => s.id === req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    Object.assign(schedule, req.body, { id: schedule.id, createdAt: schedule.createdAt });
    writeData(schedulesFile, data);
    
    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule', details: error.message });
  }
});

// Delete schedule
app.delete('/api/schedules/:id', (req, res) => {
  try {
    const data = readData(schedulesFile);
    const index = data.schedules.findIndex(s => s.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const deleted = data.schedules.splice(index, 1)[0];
    writeData(schedulesFile, data);
    
    res.json(deleted);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule', details: error.message });
  }
});

// Publish to Instagram (placeholder)
app.post('/api/publish/instagram', (req, res) => {
  try {
    const { designId, caption } = req.body;
    
    if (!designId) {
      return res.status(400).json({ error: 'designId is required' });
    }
    
    const historyRecord = {
      id: uuidv4(),
      designId,
      platform: 'instagram',
      caption: caption || 'New design from Hello Little Sleepers',
      status: 'pending', // pending, published, failed
      publishedAt: null,
      createdAt: new Date().toISOString(),
      error: 'Instagram credentials not configured. Please provide INSTAGRAM_ACCESS_TOKEN'
    };
    
    const data = readData(historyFile) || { history: [] };
    data.history.push(historyRecord);
    writeData(historyFile, data);
    
    res.status(202).json(historyRecord);
  } catch (error) {
    console.error('Error publishing to Instagram:', error);
    res.status(500).json({ error: 'Failed to publish', details: error.message });
  }
});

// Export design for email
app.post('/api/export/email', (req, res) => {
  try {
    const { designId, format } = req.body;
    
    if (!designId) {
      return res.status(400).json({ error: 'designId is required' });
    }
    
    const supportedFormats = ['png', 'pdf'];
    const exportFormat = format || 'png';
    
    if (!supportedFormats.includes(exportFormat)) {
      return res.status(400).json({ error: `Unsupported format. Supported: ${supportedFormats.join(', ')}` });
    }
    
    const exportRecord = {
      id: uuidv4(),
      designId,
      format: exportFormat,
      status: 'ready',
      downloadUrl: `https://example.com/export/${designId}.${exportFormat}`,
      createdAt: new Date().toISOString(),
      note: 'In production, this would generate actual export from Canva'
    };
    
    res.json(exportRecord);
  } catch (error) {
    console.error('Error exporting design:', error);
    res.status(500).json({ error: 'Failed to export design', details: error.message });
  }
});

// Get publishing history
app.get('/api/history', (req, res) => {
  const data = readData(historyFile);
  if (data) {
    res.json(data);
  } else {
    res.json({ history: [] });
  }
});

// Monthly trends data endpoint
app.get('/api/sales/trends', (req, res) => {
  try {
    const monthlyTrends = [
      { month: 'Oct 2025', sales: 2500 },
      { month: 'Nov 2025', sales: 3200 },
      { month: 'Dec 2025', sales: 4100 },
      { month: 'Jan 2026', sales: 3800 },
      { month: 'Feb 2026', sales: 4600 }
    ];
    
    res.json({ monthly_trends: monthlyTrends });
  } catch (error) {
    console.error('Error getting sales trends:', error);
    res.status(500).json({ error: 'Failed to get sales trends', details: error.message });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  try {
    const designs = readData(designsFile) || { designs: [] };
    const schedules = readData(schedulesFile) || { schedules: [] };
    const history = readData(historyFile) || { history: [] };
    
    const dashboard = {
      recentDesigns: designs.designs.slice(0, 5),
      scheduledPosts: schedules.schedules.filter(s => s.status === 'scheduled'),
      publishingHistory: history.history.slice(0, 10),
      stats: {
        totalDesigns: designs.designs.length,
        totalScheduled: schedules.schedules.filter(s => s.status === 'scheduled').length,
        totalPublished: history.history.filter(h => h.status === 'published').length
      }
    };
    
    res.json(dashboard);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ error: 'Failed to get dashboard data', details: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HLS Canva Automation API running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
  console.log(`🎨 Designs API: http://localhost:${PORT}/api/designs`);
});
