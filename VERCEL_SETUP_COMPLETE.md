# Vercel Deployment - Complete Setup Guide

## ✅ What's Been Prepared

- [x] Frontend Vite configuration optimized
- [x] Vercel configuration (vercel.json)
- [x] Environment variables template (.env.vercel)
- [x] Render.json for backend deployment
- [x] GitHub repository connected

## 🚀 Step-by-Step Deployment

### **Step 1: Deploy Frontend to Vercel**

1. Go to https://vercel.com/
2. Click **"Add New..."** → **"Project"**
3. Select **GitHub** repository: `Falconbeast21k/medical-kiosk`
4. Framework: **Vite**
5. Root Directory: **./client** (or leave empty if it auto-detects)
6. Build Command: `npm run build --workspace=client`
7. Output Directory: `client/dist`
8. Click **"Deploy"** ✓

### **Step 2: Add Environment Variables to Vercel**

After frontend deploys:

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL = https://your-render-backend.onrender.com
   ```
   (We'll get the backend URL in Step 3)
3. Click **"Save"**
4. Redeploy the frontend

### **Step 3: Deploy Backend to Render**

1. Go to https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select `medical-kiosk` repository
4. Configure:
   - **Name**: `medical-kiosk-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run db:init && npm run db:seed`
   - **Start Command**: `npm start`
   - **Plan**: Free tier
5. Click **"Create Web Service"**
6. Wait for deployment (2-3 minutes)
7. Copy the URL: `https://medical-kiosk-backend.onrender.com`

### **Step 4: Connect Backend to Frontend**

1. Go back to **Vercel Dashboard**
2. Select your project: `medical-kiosk`
3. **Settings** → **Environment Variables**
4. Update:
   ```
   VITE_API_URL = https://medical-kiosk-backend.onrender.com
   ```
5. Click **"Save"** → **Redeploy**

### **Step 5: Test Deployment**

1. Visit your Vercel frontend URL
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Test features:
   - Patient search
   - Vital signs monitoring
   - Consultations
   - CSV export

## 📊 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://medical-kiosk-[project-name].vercel.app`
- **Backend**: `https://medical-kiosk-backend.onrender.com`
- **GitHub**: `https://github.com/Falconbeast21k/medical-kiosk`

## 🔄 Auto-Deployment (GitHub Integration)

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both Vercel and Render will **automatically redeploy**! ✨

## 🗄️ Database

Currently using SQLite with file storage on Render. For production with multiple instances:

**Option 1: PostgreSQL (Recommended)**
- ElephantSQL: https://www.elephantsql.com/ (free tier)
- Supabase: https://supabase.com/ (free tier)

**Option 2: MongoDB**
- Atlas: https://www.mongodb.com/cloud/atlas (free tier)

## 🔐 Environment Variables Checklist

- [x] VITE_API_URL → Set in Vercel
- [x] NODE_ENV=production → Set in Render
- [x] DATABASE_PATH → Default in Render
- [x] JWT_SECRET → Auto-generated in Render
- [x] ADMIN_PASSWORD → Set in Render

## 📱 Features Available

✅ Patient Management
✅ Vital Signs Monitoring (Real-time)
✅ Consultation Records
✅ Disease Database
✅ History & Reports
✅ CSV Export
✅ Dummy Mode for Testing

## 🆘 Troubleshooting

### Frontend won't build
```bash
npm run build --workspace=client
```

### Backend not responding
- Check Render deployment logs
- Verify VITE_API_URL is correct
- Check CORS settings in server

### Database errors
- Check Render file system permissions
- Ensure db:init and db:seed ran
- Check database logs

### API 404 errors
- Verify backend URL in environment variables
- Check if backend is running on Render

## 💡 Next Steps

1. **Monitor**: Check logs regularly
   - Vercel: Dashboard → Deployments
   - Render: Dashboard → Logs

2. **Scale**: Upgrade to paid plans if needed
   - Vercel Pro: $20/month
   - Render: From $7/month

3. **Optimize**: 
   - Enable caching headers
   - Minify assets (Vite does this)
   - Use CDN (Vercel does this)

4. **Secure**:
   - Add authentication (done)
   - Use HTTPS (automatic)
   - Rate limiting (add later)

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Vite Docs: https://vitejs.dev/
- Express Docs: https://expressjs.com/
