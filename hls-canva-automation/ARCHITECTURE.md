# Architecture Overview

## System Design

The Hello Little Sleepers Design Automation Platform is built as a modern full-stack web application with clear separation between frontend and backend.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard │ Design Library │ Scheduling │ History  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST
                   ↓
┌──────────────────────────────────────────────────────────────┐
│              Express.js Backend (Port 5000)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/designs │ /api/schedules │ /api/publish       │   │
│  │  /api/export  │ /api/history   │ /api/dashboard     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┐
        ↓          ↓          ↓          ↓
    ┌────────┐┌────────┐┌─────────┐┌──────────┐
    │ Canva  ││ JSON   ││Instagram││Email    │
    │ API    ││Storage ││API      ││Service  │
    │(OAuth) ││(Local) ││(Future) ││(Future) │
    └────────┘└────────┘└─────────┘└──────────┘
```

## Backend Architecture

### Express.js Server (`backend/server.js`)

**Responsibilities:**
- RESTful API for design management
- Schedule creation and management
- Publishing history tracking
- Integration layer for external services

**Key Features:**
- CORS enabled for frontend communication
- JSON file-based data persistence
- Error handling and logging
- Health check endpoint

### Data Layer

Files stored in `data/` directory:
- `designs.json` - Design inventory
- `schedules.json` - Posting schedules
- `history.json` - Publishing records

**Data Structure:**
```
designs.json
├── designs: [
│   ├── id, title, description
│   ├── thumbnail, designUrl
│   ├── createdAt, status, format
├── lastUpdated
│
schedules.json
├── schedules: [
│   ├── id, designId, platform
│   ├── schedule (type, time, day)
│   ├── timezone, status, createdAt
│
history.json
├── history: [
│   ├── id, designId, platform
│   ├── status, caption, error
│   ├── publishedAt, createdAt
```

## Frontend Architecture

### React Components

#### Dashboard (`Dashboard.js`)
- Statistics overview
- Recent designs preview
- Upcoming scheduled posts
- Publishing history summary

#### Design Library (`DesignLibrary.js`)
- Pull designs from Canva
- Filter by format
- View design details
- Export as PNG/PDF
- Preview and sharing options

#### Scheduling Interface (`SchedulingInterface.js`)
- Create/edit schedules
- Select platform and frequency
- Set timezone
- Manage existing schedules

#### Publishing History (`PublishingHistory.js`)
- Track all publications
- Filter by platform/status
- Export data (CSV/JSON)
- View detailed records

### Styling

- Global styles in `App.css`
- Component-specific styles in individual `.css` files
- HLS brand colors (purple #8b5a8f, cream #f9f7f4)
- Responsive grid layout
- Mobile-first approach

## API Reference

### Authentication
Currently: None (assumes trusted environment)
Production: Add JWT token-based auth

### Base URL
```
http://localhost:5000/api
```

### Endpoints

**Designs**
```
GET    /designs          - List all designs
GET    /designs/:id      - Get specific design
GET    /canva/designs    - Pull from Canva account
```

**Schedules**
```
GET    /schedules        - List schedules
POST   /schedules        - Create schedule
GET    /schedules/:id    - Get schedule details
PUT    /schedules/:id    - Update schedule
DELETE /schedules/:id    - Delete schedule
```

**Publishing**
```
POST   /publish/instagram - Publish to Instagram
POST   /export/email      - Export for email
GET    /history           - Publishing history
```

**Dashboard**
```
GET    /dashboard        - All dashboard data
GET    /health           - Health check
```

## Integration Points

### 1. Canva API Integration
**Current**: Mock data (sample designs)
**Future**: Real OAuth flow to pull designs from Jade's account
- Endpoint: `GET /api/canva/designs`
- Requires: CANVA_CLIENT_ID, CANVA_CLIENT_SECRET

### 2. Instagram Integration
**Status**: Placeholder (pending credentials)
- Endpoint: `POST /api/publish/instagram`
- Requires: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
- Implementation: Instagram Graph API

### 3. Email Integration
**Status**: Export only (pending email service setup)
- Endpoint: `POST /api/export/email`
- Formats: PNG, PDF
- Future: Direct send via SendGrid/Mailchimp

## Data Flow

### Publishing Workflow

```
1. User selects design
   ↓
2. Chooses platform (Instagram/Email/etc)
   ↓
3. Creates schedule (time, frequency, timezone)
   ↓
4. System stores in schedules.json
   ↓
5. At scheduled time, system publishes
   ↓
6. Result recorded in history.json
   ↓
7. User sees update in Publishing History tab
```

### Design Flow

```
1. User clicks "Pull from Canva"
   ↓
2. System calls Canva API
   ↓
3. Designs cached in designs.json
   ↓
4. Frontend displays in Design Library
   ↓
5. User can filter, export, or schedule
```

## Deployment Considerations

### Development
- Separate terminals for backend and frontend
- Hot reload enabled
- File-based data storage

### Production
- Environment variables for all secrets
- Database instead of JSON files
- Authentication layer
- HTTPS required
- Rate limiting
- Logging and monitoring
- Auto-scaling capabilities

## Technology Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend | Express.js | Lightweight, fast, good async support |
| Frontend | React | Component-based, large ecosystem |
| Database | JSON files | Simple start, easy migration to DB later |
| Styling | CSS3 | No dependencies, mobile-responsive |
| Deployment | Node.js | Single runtime, JavaScript everywhere |

## Security Considerations

**Current (Development)**
- No authentication
- Local file access
- Assumes trusted network

**Before Production**
- [ ] Add JWT authentication
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use HTTPS
- [ ] Database encryption
- [ ] User permission levels
- [ ] Audit logging

## Future Enhancements

1. **Database Migration**
   - PostgreSQL or MongoDB
   - Replace JSON file storage

2. **Advanced Scheduling**
   - Cron job support
   - Time zone conversion
   - Conflict detection

3. **Analytics Dashboard**
   - Post engagement metrics
   - Audience insights
   - Performance trending

4. **Batch Operations**
   - Bulk upload designs
   - Multi-platform scheduling
   - Bulk export

5. **Team Collaboration**
   - User accounts
   - Permission levels
   - Approval workflows

6. **Content Moderation**
   - Pre-publish previews
   - Approval queues
   - Scheduled reviews

---

**Last Updated**: February 2024
**Version**: 1.0.0
