# API Reference

Complete documentation of the Hello Little Sleepers Design Automation API.

## Base URL
```
http://localhost:5000/api
```

## Response Format

All responses are JSON. Success responses include data, error responses include error details.

### Success Response
```json
{
  "id": "...",
  "title": "...",
  ...data
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

---

## Health Check

### GET /health
Check if the API is running.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "HLS Canva Automation API"
}
```

---

## Designs

### GET /designs
Get all cached designs from the library.

**Request:**
```bash
curl http://localhost:5000/api/designs
```

**Response:**
```json
{
  "designs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Baby Sleep Schedule Template",
      "description": "Downloadable sleep schedule for parents",
      "thumbnail": "https://via.placeholder.com/600x400",
      "designUrl": "https://www.canva.com/design/...",
      "createdAt": "2024-02-02T10:30:00Z",
      "status": "ready",
      "format": "instagram"
    }
  ],
  "lastUpdated": "2024-02-09T14:37:00Z"
}
```

---

### GET /designs/:id
Get a specific design by ID.

**Request:**
```bash
curl http://localhost:5000/api/designs/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Baby Sleep Schedule Template",
  "description": "Downloadable sleep schedule for parents",
  "thumbnail": "https://via.placeholder.com/600x400",
  "designUrl": "https://www.canva.com/design/...",
  "createdAt": "2024-02-02T10:30:00Z",
  "status": "ready",
  "format": "instagram"
}
```

**Error Response:**
```json
{
  "error": "Design not found"
}
```

---

### GET /canva/designs
Pull fresh designs from Jade's Canva account and cache them.

**Request:**
```bash
curl http://localhost:5000/api/canva/designs
```

**Response:**
```json
{
  "designs": [
    {
      "id": "...",
      "title": "Design from Canva",
      ...
    }
  ],
  "lastUpdated": "2024-02-09T14:37:00Z"
}
```

**Note:** Currently returns sample designs. Will use real Canva API when OAuth token is configured.

---

## Schedules

### GET /schedules
List all posting schedules.

**Request:**
```bash
curl http://localhost:5000/api/schedules
```

**Response:**
```json
{
  "schedules": [
    {
      "id": "schedule-123",
      "designId": "design-456",
      "platform": "instagram",
      "schedule": {
        "type": "daily",
        "time": "09:00"
      },
      "timezone": "America/New_York",
      "createdAt": "2024-02-09T14:37:00Z",
      "status": "scheduled"
    }
  ]
}
```

---

### POST /schedules
Create a new schedule.

**Request:**
```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "design-123",
    "platform": "instagram",
    "schedule": {
      "type": "daily",
      "time": "09:00"
    },
    "timezone": "America/New_York"
  }'
```

**Request Body:**
```json
{
  "designId": "string (required)",
  "platform": "string (required) - instagram|email|facebook|twitter",
  "schedule": {
    "type": "string (required) - once|daily|weekly",
    "time": "string (required) - HH:MM format",
    "day": "string (optional for weekly) - monday|tuesday|..."
  },
  "timezone": "string (required)"
}
```

**Response:**
```json
{
  "id": "new-schedule-id",
  "designId": "design-123",
  "platform": "instagram",
  "schedule": {
    "type": "daily",
    "time": "09:00"
  },
  "timezone": "America/New_York",
  "createdAt": "2024-02-09T14:37:00Z",
  "status": "scheduled"
}
```

---

### GET /schedules/:id
Get a specific schedule.

**Request:**
```bash
curl http://localhost:5000/api/schedules/schedule-123
```

**Response:**
```json
{
  "id": "schedule-123",
  "designId": "design-456",
  "platform": "instagram",
  "schedule": {
    "type": "daily",
    "time": "09:00"
  },
  "timezone": "America/New_York",
  "createdAt": "2024-02-09T14:37:00Z",
  "status": "scheduled"
}
```

---

### PUT /schedules/:id
Update a schedule.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/schedules/schedule-123 \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": {
      "type": "weekly",
      "time": "10:00",
      "day": "monday"
    }
  }'
```

**Response:**
```json
{
  "id": "schedule-123",
  "designId": "design-456",
  "platform": "instagram",
  "schedule": {
    "type": "weekly",
    "time": "10:00",
    "day": "monday"
  },
  "timezone": "America/New_York",
  "createdAt": "2024-02-09T14:37:00Z",
  "status": "scheduled"
}
```

---

### DELETE /schedules/:id
Delete a schedule.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/schedules/schedule-123
```

**Response:**
```json
{
  "id": "schedule-123",
  "designId": "design-456",
  "platform": "instagram",
  "schedule": {
    "type": "daily",
    "time": "09:00"
  },
  "timezone": "America/New_York",
  "createdAt": "2024-02-09T14:37:00Z",
  "status": "scheduled"
}
```

---

## Publishing

### POST /publish/instagram
Publish a design to Instagram (placeholder - requires credentials).

**Request:**
```bash
curl -X POST http://localhost:5000/api/publish/instagram \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "design-123",
    "caption": "Check out this new design!"
  }'
```

**Request Body:**
```json
{
  "designId": "string (required)",
  "caption": "string (optional)"
}
```

**Response:**
```json
{
  "id": "history-entry-123",
  "designId": "design-123",
  "platform": "instagram",
  "caption": "Check out this new design!",
  "status": "pending",
  "publishedAt": null,
  "createdAt": "2024-02-09T14:37:00Z",
  "error": "Instagram credentials not configured. Please provide INSTAGRAM_ACCESS_TOKEN"
}
```

**Status Code:** 202 Accepted (operation in progress)

---

### POST /export/email
Export a design for email use.

**Request:**
```bash
curl -X POST http://localhost:5000/api/export/email \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "design-123",
    "format": "png"
  }'
```

**Request Body:**
```json
{
  "designId": "string (required)",
  "format": "string (optional) - png|pdf (default: png)"
}
```

**Response:**
```json
{
  "id": "export-123",
  "designId": "design-123",
  "format": "png",
  "status": "ready",
  "downloadUrl": "https://example.com/export/design-123.png",
  "createdAt": "2024-02-09T14:37:00Z",
  "note": "In production, this would generate actual export from Canva"
}
```

---

## History

### GET /history
Get publishing history.

**Request:**
```bash
curl http://localhost:5000/api/history
```

**Response:**
```json
{
  "history": [
    {
      "id": "history-entry-1",
      "designId": "design-123",
      "platform": "instagram",
      "caption": "New design!",
      "status": "published",
      "publishedAt": "2024-02-09T10:00:00Z",
      "createdAt": "2024-02-09T09:50:00Z",
      "error": null
    }
  ]
}
```

---

## Dashboard

### GET /dashboard
Get complete dashboard data (designs, schedules, history summaries).

**Request:**
```bash
curl http://localhost:5000/api/dashboard
```

**Response:**
```json
{
  "recentDesigns": [
    {
      "id": "design-1",
      "title": "Design Title",
      ...
    }
  ],
  "scheduledPosts": [
    {
      "id": "schedule-1",
      "designId": "design-1",
      "platform": "instagram",
      ...
    }
  ],
  "publishingHistory": [
    {
      "id": "history-1",
      "designId": "design-1",
      "platform": "instagram",
      "status": "published",
      ...
    }
  ],
  "stats": {
    "totalDesigns": 5,
    "totalScheduled": 3,
    "totalPublished": 12
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 202 | Accepted - Request accepted, processing |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Error Handling

### Common Errors

**Missing Required Field:**
```json
{
  "error": "Missing required fields: designId, platform, schedule"
}
```

**Resource Not Found:**
```json
{
  "error": "Design not found"
}
```

**Server Error:**
```json
{
  "error": "Failed to save schedule",
  "details": "Error message from server"
}
```

---

## Testing with cURL

### Test Health
```bash
curl http://localhost:5000/api/health
```

### Pull Designs
```bash
curl http://localhost:5000/api/canva/designs
```

### Create Schedule
```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "designId": "test-123",
    "platform": "instagram",
    "schedule": {
      "type": "daily",
      "time": "09:00"
    },
    "timezone": "UTC"
  }'
```

### Get Dashboard
```bash
curl http://localhost:5000/api/dashboard | json_pp
```

---

**Last Updated**: February 2024
**API Version**: 1.0.0
