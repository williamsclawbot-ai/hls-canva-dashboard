# Deployment Guide

Guide for deploying the Hello Little Sleepers Design Automation Platform to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] API endpoints tested
- [ ] Security hardened
- [ ] Database migrated (if applicable)
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Logging configured

## Environment Setup

### Production Environment Variables

Create `.env` file in backend directory with:

```bash
# Server
PORT=8000
NODE_ENV=production

# Canva
CANVA_CLIENT_ID=OC-AZxAnRiDaaya
CANVA_CLIENT_SECRET=YOUR_SECRET_HERE

# Instagram (when credentials available)
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id

# Email Service (when configured)
SENDGRID_API_KEY=your_api_key
EMAIL_FROM_ADDRESS=noreply@hellolittlesleepers.com

# Database (if migrating from JSON)
DATABASE_URL=postgresql://user:password@host:5432/hls_db

# Security
JWT_SECRET=your_secret_key_here
SESSION_SECRET=your_session_secret_here

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/hls-automation/app.log

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Local Development

### Quick Start

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)
cd frontend && npm start

# Open http://localhost:3000
```

### Development Server

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:3000`

## Production Deployment Options

### Option 1: Heroku

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create hls-canva-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set CANVA_CLIENT_ID=OC-AZxAnRiDaaya
   heroku config:set CANVA_CLIENT_SECRET=YOUR_SECRET_HERE
   # ... add other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment

1. **Build React App**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel, Netlify, or GitHub Pages**
   ```bash
   # Vercel
   npm install -g vercel
   vercel
   
   # Netlify
   npm install -g netlify-cli
   netlify deploy
   ```

### Option 2: DigitalOcean

#### Setup Droplet

1. **Create Droplet**
   - OS: Ubuntu 22.04
   - Size: $6/month (Basic)
   - Region: Choose closest

2. **SSH into Droplet**
   ```bash
   ssh root@your_ip_address
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

4. **Clone Repository**
   ```bash
   cd /var/www
   git clone <your-repo> hls-canva-automation
   cd hls-canva-automation
   ```

5. **Install App Dependencies**
   ```bash
   cd backend
   npm install --production
   
   cd ../frontend
   npm install
   npm run build
   ```

6. **Start Backend with PM2**
   ```bash
   cd backend
   pm2 start server.js --name "hls-api"
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```bash
   # Edit /etc/nginx/sites-available/default
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   upstream hls_api {
     server 127.0.0.1:5000;
   }

   server {
     listen 80;
     server_name yourdomain.com;

     location /api {
       proxy_pass http://hls_api;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }

     location / {
       root /var/www/hls-canva-automation/frontend/build;
       index index.html index.htm;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

8. **Enable SSL (Let's Encrypt)**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

9. **Restart Nginx**
   ```bash
   systemctl restart nginx
   ```

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04
   - Type: t2.micro (free tier)
   - Security Group: Allow ports 22, 80, 443

2. **SSH and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Follow DigitalOcean steps above
   ```

3. **Use AWS RDS for Database** (optional)

### Option 4: Docker Containerization

#### Dockerfile - Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Dockerfile - Frontend

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
    env_file:
      - .env

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

**Run:**
```bash
docker-compose up -d
```

## Database Migration (From JSON to PostgreSQL)

### Schema

```sql
-- Designs table
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  design_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50),
  format VARCHAR(50),
  created_by UUID REFERENCES users(id)
);

-- Schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  platform VARCHAR(50),
  schedule_type VARCHAR(50),
  schedule_time TIME,
  schedule_day VARCHAR(20),
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50),
  created_by UUID REFERENCES users(id)
);

-- History table
CREATE TABLE publishing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id),
  platform VARCHAR(50),
  status VARCHAR(50),
  caption TEXT,
  error TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Migration Script

```javascript
// backend/scripts/migrate-to-postgres.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  await client.connect();
  
  try {
    // Read JSON files
    const designs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/designs.json')));
    const schedules = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedules.json')));
    
    // Insert designs
    for (const design of designs.designs) {
      await client.query(
        'INSERT INTO designs (id, title, description, thumbnail, design_url, created_at, status, format) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [design.id, design.title, design.description, design.thumbnail, design.designUrl, design.createdAt, design.status, design.format]
      );
    }
    
    console.log('✅ Migration complete');
  } finally {
    await client.end();
  }
}

migrate().catch(console.error);
```

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs hls-api
pm2 logs hls-api --lines 100
```

### Application Logging

Update `backend/server.js`:

```javascript
const fs = require('fs');
const logStream = fs.createWriteStream(process.env.LOG_FILE || 'app.log', { flags: 'a' });

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
  if (process.env.NODE_ENV !== 'production') console.log(logMessage);
}
```

### Third-Party Services

- **Sentry** - Error tracking
- **LogRocket** - User session replay
- **New Relic** - Application performance
- **Datadog** - Monitoring

## Maintenance

### Regular Backups

```bash
# Backup JSON data
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Updates

```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Rebuild frontend
cd frontend && npm run build

# Restart services
pm2 restart all
```

### Health Checks

```bash
# Check API health
curl https://yourdomain.com/api/health

# Monitor Uptime
# Use UptimeRobot or similar service
```

## Security Checklist

- [ ] Environment variables in `.env` (not in git)
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Authentication/Authorization implemented
- [ ] Database credentials secure
- [ ] Regular security updates
- [ ] Firewalls configured
- [ ] DDoS protection (CloudFlare, AWS Shield)

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### PM2 Not Restarting
```bash
pm2 delete all
pm2 start server.js
pm2 save
```

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

**Last Updated**: February 2024
**Version**: 1.0.0
