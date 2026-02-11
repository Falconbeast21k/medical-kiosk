# Deploying Medical Kiosk to Vercel

## Quick Start

### Option 1: Deploy Frontend to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd client
vercel

# Answer the prompts:
# - Set project name: medical-kiosk
# - Select framework: Vite
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

### Option 2: Deploy Full Stack to Render + Vercel

**Backend on Render.com:**
1. Go to https://render.com/
2. Create account
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm install && cd server && npm run db:init && npm run db:seed`
   - Start Command: `cd server && npm start`
   - Environment Variables: Add `NODE_ENV=production`
6. Deploy

**Frontend on Vercel:**
1. After backend is live on Render, get the URL
2. In Vercel, set environment variable:
   - `VITE_API_URL=https://your-render-backend-url`
3. Deploy frontend

### Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com
```

## Free Tier Limitations

**Vercel Free:**
- ✅ Unlimited projects
- ✅ Unlimited bandwidth
- ✅ Serverless functions
- ❌ No persistent storage (use database service)

**Render Free:**
- ✅ 1 free web service
- ✅ PostgreSQL database available
- ❌ Spins down after 15 min inactivity

## Database Migration (For Production)

If you want persistent data, migrate to PostgreSQL:

1. Create free PostgreSQL on https://www.elephantsql.com/
2. Update server connection string
3. Create new SQL migration scripts
4. Deploy backend with new database

## Testing After Deployment

1. Visit: https://medical-kiosk-yourname.vercel.app
2. Login with: admin / admin123
3. Test all features
4. Check backend connectivity

## Git Workflow for Deployment

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
# Vercel auto-deploys on git push
```

## Troubleshooting

- **Build fails**: Check `npm run build` locally first
- **API not working**: Verify `VITE_API_URL` env variable
- **Database errors**: Migrate to cloud database (PostgreSQL/MongoDB)
- **Cold starts**: Use Render's paid tier or Railway for always-on backend

## Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
