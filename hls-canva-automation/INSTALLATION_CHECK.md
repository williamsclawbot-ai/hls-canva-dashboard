# Installation Check Checklist

Use this checklist to verify everything is installed and working.

## ✅ Pre-Installation Check

- [ ] Node.js installed (`node -v` shows v14+)
- [ ] npm installed (`npm -v` works)
- [ ] 2GB free disk space
- [ ] Port 3000 available (React)
- [ ] Port 5000 available (Express)

## ✅ Directory Structure

- [ ] `/Users/openclaw/.openclaw/workspace-prod/hls-canva-automation/` exists
- [ ] `backend/` directory exists
- [ ] `frontend/` directory exists
- [ ] `README.md` file exists
- [ ] `QUICKSTART.md` file exists
- [ ] `setup.sh` file exists

## ✅ Backend Setup

```bash
cd backend
npm install
```

Check for:
- [ ] No errors during installation
- [ ] `node_modules/` directory created
- [ ] `package-lock.json` created
- [ ] `.env` file exists with Canva credentials

## ✅ Frontend Setup

```bash
cd ../frontend
npm install
```

Check for:
- [ ] No errors during installation
- [ ] `node_modules/` directory created
- [ ] `package-lock.json` created
- [ ] `public/index.html` exists
- [ ] `src/App.js` exists

## ✅ Backend Start Test

```bash
cd backend
npm start
```

Should see:
- [ ] `🚀 HLS Canva Automation API running on http://localhost:5000`
- [ ] `📊 Dashboard API: http://localhost:5000/api/dashboard`
- [ ] `🎨 Designs API: http://localhost:5000/api/designs`
- [ ] No error messages
- [ ] Server stays running (Ctrl+C to stop)

## ✅ Frontend Start Test

```bash
cd ../frontend
npm start
```

Should see:
- [ ] React app compiles successfully
- [ ] Browser opens to `http://localhost:3000`
- [ ] No build errors
- [ ] "Hello Little Sleepers" header visible

## ✅ API Connectivity Test

Backend running, in another terminal:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"ok","service":"HLS Canva Automation API"}
```

## ✅ UI Navigation Test

In the browser (http://localhost:3000):
- [ ] Dashboard tab visible and loads
- [ ] Design Library tab visible and loads
- [ ] Scheduling tab visible and loads
- [ ] Publishing History tab visible and loads
- [ ] HLS logo and branding visible

## ✅ Design Pull Test

1. Click "Design Library" tab
2. Click "Pull Designs from Canva"
3. Should see loading indicator
4. Should show 3+ sample designs

Check for:
- [ ] No console errors (F12)
- [ ] Designs display correctly
- [ ] Can click on designs for details
- [ ] Export buttons work

## ✅ Scheduling Test

1. Click "Scheduling" tab
2. Should see form and schedule list
3. Try creating a schedule:
   - [ ] Select a design
   - [ ] Choose platform (Instagram)
   - [ ] Set daily frequency
   - [ ] Set time (09:00)
   - [ ] Click "Create Schedule"

Check for:
- [ ] Schedule appears in list
- [ ] Can edit the schedule
- [ ] Can delete the schedule

## ✅ Dashboard Test

1. Click "Dashboard" tab
2. Should see stats:
   - [ ] Total Designs count
   - [ ] Scheduled Posts count
   - [ ] Published Posts count
3. Should see sections for:
   - [ ] Recent Designs
   - [ ] Upcoming Scheduled Posts
   - [ ] Recent Publishing History

## ✅ Performance Test

- [ ] Dashboard loads in < 2 seconds
- [ ] Design library loads in < 2 seconds
- [ ] Creating schedule takes < 1 second
- [ ] No lag when switching tabs

## ✅ Mobile Responsive Test

On desktop:
1. Press F12 (Developer Tools)
2. Click responsive design mode icon
3. Set to "iPhone 12" size

Check for:
- [ ] Layout adjusts for mobile
- [ ] Buttons are still clickable
- [ ] Text is readable
- [ ] No horizontal scroll needed

## ✅ Error Handling Test

Try these intentionally:
- [ ] Leave design field empty and submit schedule → Error shown
- [ ] Check browser console (F12) for errors → Should be clean
- [ ] Stop backend server and try to pull designs → Error shown gracefully

## ✅ Data Persistence Test

1. Create a schedule
2. Refresh the page (F5)
3. Go to Scheduling tab
4. Check for:
   - [ ] Schedule still there
   - [ ] Data wasn't lost

## ✅ Document Check

Verify these files exist and are readable:
- [ ] README.md (read it!)
- [ ] QUICKSTART.md (follow it!)
- [ ] ARCHITECTURE.md
- [ ] API_REFERENCE.md
- [ ] DEPLOYMENT.md
- [ ] BUILD_SUMMARY.md

## ✅ Canva Credentials Check

Check `backend/.env`:
```bash
cat backend/.env
```

Should show:
- [ ] `CANVA_CLIENT_ID=OC-AZxAnRiDaaya`
- [ ] `CANVA_CLIENT_SECRET=YOUR_SECRET_HERE`
- [ ] No error messages when reading file

## ✅ Final Verification

All of the above checked? You're ready to go! 🎉

## 🆘 Troubleshooting

If something fails:

1. **Port already in use**
   ```bash
   lsof -i :5000  # or :3000
   kill -9 <PID>
   ```

2. **npm install fails**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **React won't compile**
   ```bash
   npm cache clean --force
   npm install
   npm start
   ```

4. **Can't connect backend to frontend**
   - Make sure backend is running on 5000
   - Make sure frontend is running on 3000
   - Check for errors in browser console (F12)

5. **Missing files**
   ```bash
   cd /Users/openclaw/.openclaw/workspace-prod/hls-canva-automation
   ls -la
   ```

## 📞 Next Steps

Once all checks pass:
1. Read README.md for full documentation
2. Test pulling real designs from Canva
3. Create some schedules
4. Explore the Publishing History
5. Share feedback with the team
6. Provide Instagram/Email credentials when ready

---

**Date Checked**: [Your Date]
**Checked By**: [Your Name]
**Status**: ✅ All Systems Go!
