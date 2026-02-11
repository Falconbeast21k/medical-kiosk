# 🏥 Medical Kiosk - Quick Start Guide

## Installation Requirements

Before running the Medical Kiosk application, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## Step-by-Step Setup

### Windows Users

1. **Install Node.js**
   - Go to https://nodejs.org/
   - Download LTS version (v18 or v20)
   - Run installer and follow prompts
   - Close and reopen PowerShell to reload PATH

2. **Navigate to Medical Kiosk Directory**
   ```powershell
   cd c:\eclipse\medical-kiosk
   ```

3. **Run Setup Script**
   ```powershell
   .\setup.bat
   ```

   Or manually:
   ```powershell
   npm run install-all
   cd server
   npm run db:init
   npm run db:seed
   cd ..
   ```

4. **Start the Application**
   ```powershell
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Mac/Linux Users

1. **Install Node.js**
   ```bash
   # Using Homebrew (Mac)
   brew install node

   # Using apt (Linux)
   sudo apt-get install nodejs npm
   ```

2. **Navigate to Directory**
   ```bash
   cd /path/to/medical-kiosk
   ```

3. **Run Setup Script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   Or manually:
   ```bash
   npm run install-all
   cd server && npm run db:init && npm run db:seed && cd ..
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

## First Login

Once the application starts:

1. Open browser to: **http://localhost:3000**
2. Login with credentials:
   - **Username:** admin
   - **Password:** admin123
3. Select mode:
   - **Dummy Mode** (for testing/demo) - recommended for first use
   - **Practical Mode** (for real hardware)
4. Click "Login"

## First Test Run

### In Dummy Mode:

1. **Login** with demo credentials
2. **Select Patient** from the list (10 pre-loaded patients available)
3. **View Vitals** - Auto-refreshes with simulated data
4. **Add Consultation**:
   - Enter symptoms (e.g., "headache", "fever")
   - System suggests diagnosis
   - Review medications and advice
   - Save consultation
5. **View Reports** - Check history and export data

## Available Commands

```bash
# Install all dependencies
npm run install-all

# Start development (frontend + backend)
npm run dev

# Build for production
npm run build

# Backend only - development
cd server && npm run dev

# Backend only - start
cd server && npm start

# Frontend only - development
cd client && npm run dev

# Initialize database
cd server && npm run db:init

# Seed database with sample data
cd server && npm run db:seed
```

## Database Access

The SQLite database is created at: `medical-kiosk/database/medical_kiosk.db`

To view/edit database (install SQLite3):
```bash
sqlite3 database/medical_kiosk.db
```

## Sample Data

After seeding, the database includes:

- **Admin User**
  - Username: admin
  - Password: admin123

- **15 Common Diseases**
  - Hypertension, Diabetes, Common Cold, Fever, Gastritis, Migraine, Asthma, UTI, Allergic Rhinitis, Anxiety Disorder, Constipation, Diarrhea, Influenza, Anemia, Insomnia

- **10 Dummy Patients**
  - Various ages and medical histories for testing

## Troubleshooting

### Issue: "npm is not recognized"
**Solution:** 
- Node.js not installed or PATH not updated
- Reinstall Node.js and restart terminal

### Issue: Port 3000 or 5000 already in use
**Solution:**
- Edit `client/vite.config.js` - change port number
- Edit `server/.env` - change PORT value
- Or kill process using the port

### Issue: Database errors
**Solution:**
```bash
cd server
rm database/medical_kiosk.db
npm run db:init
npm run db:seed
```

### Issue: Module not found errors
**Solution:**
```bash
npm run install-all
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

## Features Overview

✅ **Dummy Mode** - Fully functional with simulated data
✅ **Patient Management** - Register and search patients
✅ **Vital Signs** - Real-time monitoring with color alerts
✅ **Consultations** - Symptom checker with diagnosis
✅ **Disease Database** - 15+ conditions with treatments
✅ **Reports** - CSV export and PDF generation
✅ **Security** - Password protection and audit logs
✅ **Responsive UI** - Optimized for tablets

## Next Steps

1. ✅ Run `npm run install-all`
2. ✅ Initialize database: `cd server && npm run db:init && npm run db:seed`
3. ✅ Start app: `npm run dev`
4. ✅ Login and test features
5. ✅ For Practical Mode, configure USB device connections

## Documentation Files

- **README.md** - Comprehensive feature documentation
- **DEPLOYMENT.md** - Production deployment guide
- **This file** - Setup and quick start guide

## Support

For issues, check:
1. Node.js version (use v16+)
2. Port conflicts
3. Database existence
4. All dependencies installed

## Version Info

- **Version:** 1.0.0
- **Status:** ✅ Production Ready (Dummy Mode)
- **Last Updated:** February 2026

---

**Happy testing! 🏥**

Questions? Refer to the comprehensive README.md for detailed documentation.
