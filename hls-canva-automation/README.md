# Hello Little Sleepers - Design Automation & Publishing Platform

A modern, full-stack application for managing and publishing Hello Little Sleepers (HLS) designs from Canva to social media and email channels.

## 🌟 Features

### ✨ Current Features
- **🎨 Design Library**: Pull and manage designs from Jade's Canva account
- **📅 Smart Scheduling**: Create daily/weekly posting schedules
- **📊 Dashboard**: Real-time overview of designs, schedules, and publishing history
- **📧 Email Export**: Save designs as PNG/PDF for email campaigns
- **📱 Social Media Preparation**: Ready for Instagram, Facebook, Twitter integration
- **📜 Publishing History**: Track all posts and their performance status

### 🚀 Coming Soon
- **Instagram Direct Publishing**: Post designs directly to @hellolittlesleepers
- **Email Template Export**: Automatic email-ready asset generation
- **Advanced Analytics**: Track engagement and reach
- **Bulk Upload**: Upload multiple designs at once

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18 + CSS3
- **API**: RESTful architecture
- **Data Storage**: JSON-based (file system)
- **Credentials**: Canva API (provided)

## 📦 Project Structure

```
hls-canva-automation/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML entry point
│   ├── src/
│   │   ├── index.js        # React entry point
│   │   ├── App.js          # Main App component
│   │   ├── App.css         # Main styles
│   │   └── components/
│   │       ├── Dashboard.js
│   │       ├── DesignLibrary.js
│   │       ├── SchedulingInterface.js
│   │       ├── PublishingHistory.js
│   │       └── [.css files]
│   └── package.json        # Frontend dependencies
├── data/                   # Data storage (auto-created)
│   ├── designs.json
│   ├── schedules.json
│   └── history.json
└── README.md               # This file

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+) and npm
- Git
- Canva account with authorization (already configured)

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd /Users/openclaw/.openclaw/workspace-prod/hls-canva-automation
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

The backend requires HLS Canva credentials. Copy `backend/.env.example` to `backend/.env` and configure:

```
PORT=5000
CANVA_CLIENT_ID=your_client_id_here
CANVA_CLIENT_SECRET=your_client_secret_here
```

For additional integrations (when ready), add:
```
INSTAGRAM_ACCESS_TOKEN=<your_token>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<account_id>
```

### Running the Application

**Terminal 1 - Start the Backend** (port 5000):
```bash
cd backend
npm start
```

You should see:
```
🚀 HLS Canva Automation API running on http://localhost:5000
📊 Dashboard API: http://localhost:5000/api/dashboard
🎨 Designs API: http://localhost:5000/api/designs
```

**Terminal 2 - Start the Frontend** (port 3000):
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

## 📱 Using the Platform

### Dashboard
- Overview of recent designs
- Scheduled posts summary
- Publishing history stats

### Design Library
- **Pull Designs**: Click "Pull Designs from Canva" to fetch from Jade's account
- **View Details**: Click any design to see full details
- **Export**: Save designs as PNG or PDF for email use
- **Filter**: Filter by format (Instagram, Email, PDF)

### Scheduling
- Create new schedules for designs
- Choose platforms (Instagram, Email, Facebook, Twitter)
- Set frequency (Once, Daily, Weekly)
- Pick timezone for accurate scheduling
- Edit or delete existing schedules

### Publishing History
- Track all published posts
- Filter by platform or status
- View post details and timestamps
- Export data as CSV or JSON

## 🔌 API Endpoints

### Designs
- `GET /api/designs` - Get all cached designs
- `GET /api/designs/:id` - Get specific design
- `GET /api/canva/designs` - Pull fresh designs from Canva

### Schedules
- `GET /api/schedules` - List all schedules
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/:id` - Get specific schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Publishing
- `POST /api/publish/instagram` - Publish to Instagram (placeholder)
- `POST /api/export/email` - Export design for email

### Data
- `GET /api/dashboard` - Dashboard summary
- `GET /api/history` - Publishing history
- `GET /api/health` - Health check

## 📊 Data Format

### Design Object
```json
{
  "id": "uuid",
  "title": "Design Title",
  "description": "Design description",
  "thumbnail": "image_url",
  "designUrl": "https://www.canva.com/design/...",
  "createdAt": "2024-02-09T...",
  "status": "ready",
  "format": "instagram|email|pdf"
}
```

### Schedule Object
```json
{
  "id": "uuid",
  "designId": "design_id",
  "platform": "instagram|email|facebook|twitter",
  "schedule": {
    "type": "once|daily|weekly",
    "time": "09:00",
    "day": "monday"
  },
  "timezone": "UTC",
  "createdAt": "2024-02-09T...",
  "status": "scheduled"
}
```

## 🔐 Security Notes

- Canva credentials are stored in `.env` (never commit to Git)
- `.gitignore` protects sensitive files
- API uses standard REST with no authentication (assumes local/trusted network)
- For production, implement authentication and HTTPS

## 📝 Next Steps for Instagram Integration

1. **Get Jade's Instagram Credentials**:
   - Instagram Business Account ID
   - Instagram Graph API Access Token

2. **Update `.env`**:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
   ```

3. **Update backend publish endpoint** to make actual API calls

4. **Test** with sample designs

## 📝 Next Steps for Email Integration

1. **Choose Email Service**:
   - SendGrid
   - Mailchimp
   - AWS SES
   - Custom email server

2. **Add Credentials** to `.env`

3. **Implement email template logic** in backend

4. **Test** export and delivery

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check port is available
lsof -i :5000

# Clear node_modules and reinstall
rm -rf backend/node_modules package-lock.json
npm install
```

### Frontend not connecting to backend
- Ensure backend is running on port 5000
- Check CORS is enabled (it is in server.js)
- Check browser console for errors

### No designs showing
- Click "Pull Designs from Canva" button
- Check backend logs for API errors
- Verify Canva credentials are correct

## 📞 Support

For issues or questions:
1. Check the logs in the terminal
2. Verify all environment variables are set
3. Ensure both servers are running
4. Check browser developer console (F12)

## 📄 License

Hello Little Sleepers © 2024

---

**Version**: 1.0.0
**Last Updated**: February 2024
