# Vercel Full-Stack Deployment Guide

This guide explains how to deploy the HLS Canva Dashboard as a full-stack application on Vercel (backend + frontend).

## Architecture Overview

The deployment is structured as a monorepo with:
- **Frontend**: React application (built and served as static assets)
- **Backend**: Express.js API (deployed as serverless functions in `/api`)
- **Routing**: Automatic routing of `/api/*` requests to backend functions

## Configuration Files

### vercel.json
- Defines the build command and output directory
- Routes API calls (`/api/*`) to backend serverless functions
- Configures frontend SPA routing (404 → index.html)
- Sets memory and timeout limits for serverless functions

### api/index.js
- Express.js app exported as a Vercel serverless function
- Contains all API routes (designs, schedules, publishing, etc.)
- Uses `/tmp` for data storage in Vercel environment
- All routes use relative paths (no `/api` prefix in routes)

### Root package.json
- Defines monorepo workspaces
- Build script: `npm run build` → builds React frontend
- No `start` script needed (Vercel uses serverless functions)

## Deployment Steps

### 1. Verify Files Are Committed

```bash
cd /Users/openclaw/.openclaw/workspace-prod/hls-canva-automation
git status
```

You should see these new/modified files:
- `vercel.json` ✅
- `api/index.js` ✅
- `package.json` (root, updated) ✅
- `backend/package.json` (updated) ✅
- `frontend/package.json` (proxy removed) ✅
- `.env.example` ✅
- `.vercelignore` ✅
- `VERCEL_DEPLOYMENT_GUIDE.md` ✅

### 2. Commit Changes

```bash
git add -A
git commit -m "Add Vercel full-stack configuration with serverless backend"
git push origin master
```

### 3. Trigger Vercel Redeploy (For Jade)

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select project `hls-canva-dashboard`
3. Click "Settings" → "Git"
4. Click "Deploy" button on the latest commit, OR
5. Go to "Deployments" tab and click "Redeploy" on any previous deployment

**Option B: Via Vercel CLI** (if installed locally)
```bash
vercel --prod --force
```

**Option C: Via GitHub Webhook** (automatic)
- Once files are pushed to GitHub, Vercel will automatically detect the changes
- Check https://vercel.com/dashboard → hls-canva-dashboard → Deployments
- A new deployment should start automatically

## Environment Variables Setup

1. In Vercel Dashboard:
   - Go to hls-canva-dashboard project
   - Settings → Environment Variables
   - Add these variables:

| Variable | Value | Required |
|----------|-------|----------|
| CANVA_CLIENT_ID | Your Canva API credentials | Yes |
| CANVA_CLIENT_SECRET | Your Canva API secret | Yes |
| INSTAGRAM_ACCESS_TOKEN | Your Instagram token | Optional |
| NODE_ENV | production | Auto (set by Vercel) |

## API Routes

All API routes are now accessible at:
- https://hls-canva-dashboard.vercel.app/api/...

**Available Endpoints:**
- `GET /api/health` - Health check
- `GET /api/designs` - Get all cached designs
- `GET /api/designs/:id` - Get design details
- `POST /api/schedules` - Create schedule
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule details
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `POST /api/publish/instagram` - Publish to Instagram
- `POST /api/export/email` - Export design
- `GET /api/history` - Get publishing history
- `GET /api/dashboard` - Get dashboard data

## Frontend SPA Routing

The `vercel.json` includes:
```json
{
  "src": "/(.*)",
  "dest": "/index.html",
  "status": 200
}
```

This ensures all non-API routes are served by React Router for client-side routing.

## Troubleshooting

### API returns 404
- Check that `/api` routes in vercel.json are correctly configured
- Ensure `api/index.js` exists and exports the Express app
- Check build logs in Vercel dashboard

### Frontend shows 404 for routes
- Verify SPA routing rule in vercel.json is correctly set
- Check that frontend build succeeds in Vercel logs

### Env variables not loading
- Ensure variables are set in Vercel Dashboard (not just `.env` file)
- Redeploy after adding env variables

### Build fails
- Check `npm run build` works locally: `cd frontend && npm run build`
- Verify all dependencies are installed
- Check Node.js version matches Vercel (18.x)

## Local Development

To test the full-stack setup locally:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

Frontend will be at http://localhost:3000
Backend API at http://localhost:5000

To test API calls, update the frontend to use:
- Development: `http://localhost:5000/api/...` (or use proxy)
- Production: `/api/...` (relative paths)

## Key Changes from Original Setup

| Aspect | Before | After |
|--------|--------|-------|
| Backend | Node.js server (port 5000) | Vercel serverless functions |
| Frontend proxy | Hardcoded to localhost:5000 | Removed (uses relative paths) |
| Data storage | Local filesystem `/data` | Temp storage `/tmp` in Vercel |
| API paths | `/api/...` from backend | Routed via `/api/*` in vercel.json |
| Deployment | Manual server | Auto-deployed via Vercel |

## What's Next

1. ✅ Configuration files created and committed
2. ✅ Push to GitHub completed
3. 🔄 **Await Vercel automatic deployment** (or manually trigger)
4. 📊 Test API at https://hls-canva-dashboard.vercel.app/api/health
5. 🎨 Access dashboard at https://hls-canva-dashboard.vercel.app

## Support

For more details:
- Vercel Docs: https://vercel.com/docs
- Express on Vercel: https://vercel.com/docs/concepts/functions/serverless-functions/node
- React Router: https://reactrouter.com/
