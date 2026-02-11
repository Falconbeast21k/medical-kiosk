# Medical Kiosk - Complete Directory Structure

```
medical-kiosk/                          ← Project root
│
├── 📄 package.json                      ← Root workspaces config
├── 📄 .gitignore                        ← Git ignore rules
├── 🚀 setup.bat                         ← Windows setup script
├── 🚀 setup.sh                          ← Linux/Mac setup script
│
├── 📖 Documentation Files
│   ├── README.md                        ← Complete feature guide
│   ├── QUICKSTART.md                    ← Quick setup instructions
│   ├── DEPLOYMENT.md                    ← Production deployment
│   ├── API.md                           ← API reference & examples
│   └── IMPLEMENTATION_SUMMARY.md        ← Project overview
│
├── 📁 client/                           ← Frontend (React + Vite)
│   │
│   ├── 📄 package.json                  ← Frontend dependencies
│   ├── 📄 vite.config.js                ← Vite configuration
│   ├── 📄 tailwind.config.js            ← Tailwind theme config
│   ├── 📄 postcss.config.js             ← PostCSS configuration
│   ├── 📄 index.html                    ← HTML entry point
│   │
│   └── 📁 src/
│       │
│       ├── 🎨 index.css                 ← Global Tailwind styles
│       ├── ⚛️  App.jsx                   ← Main dashboard component
│       ├── 🚀 main.jsx                  ← React entry point
│       │
│       ├── 📁 components/
│       │   ├── PatientModal.jsx         ← Patient search/register modal
│       │   ├── VitalSignsPanel.jsx      ← Real-time vitals display
│       │   ├── ConsultationModule.jsx   ← Symptom checker & diagnosis
│       │   └── HistoryAndReports.jsx    ← Patient history & exports
│       │
│       ├── 📁 pages/
│       │   └── LoginPage.jsx            ← Authentication page
│       │
│       └── 📁 utils/
│           ├── api.js                   ← Axios API client
│           └── dummyDataGenerator.js    ← Dummy data generation
│
├── 📁 server/                           ← Backend (Express + SQLite)
│   │
│   ├── 📄 package.json                  ← Server dependencies
│   ├── 📄 .env                          ← Environment variables
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 🔧 index.js                  ← Express server entry point
│   │   ├── 🗄️  db.js                    ← SQLite connection manager
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── auth.js                  ← POST /auth/login, etc.
│   │   │   ├── patients.js              ← GET/POST /patients
│   │   │   ├── vitals.js                ← POST /vitals, etc.
│   │   │   ├── consultations.js         ← POST /consultations
│   │   │   ├── diseases.js              ← GET /diseases
│   │   │   └── settings.js              ← GET/POST /settings
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── errorHandler.js          ← Error handling middleware
│   │   │
│   │   └── 📁 controllers/
│   │       └── (Business logic in routes for simplicity)
│   │
│   └── 📁 scripts/
│       ├── initDb.js                    ← Creates database schema
│       └── seedDb.js                    ← Populates sample data
│
├── 📁 database/                         ← SQLite database (created on init)
│   └── medical_kiosk.db                 ← SQLite database file
│
└── 📁 public/                           ← Static files (empty)
    └── (favicon, assets if needed)
```

---

## 📊 File Statistics

| Directory | Purpose | Files | Total LOC |
|-----------|---------|-------|----------|
| **client/src** | React UI components | 7 | ~2,500 |
| **server/src** | Express backend | 6 | ~1,500 |
| **scripts** | Database setup | 2 | ~500 |
| **docs** | Documentation | 4 | ~2,000 |

**Total Project Size:** ~6,500 lines of code + documentation

---

## 🗂️ Database Schema

```
medical_kiosk.db
│
├── 👥 users
│   ├── id (PRIMARY KEY)
│   ├── username (UNIQUE)
│   ├── password_hash
│   ├── role
│   └── created_at
│
├── 🏥 patients
│   ├── id (PRIMARY KEY)
│   ├── name
│   ├── age
│   ├── gender
│   ├── contact
│   ├── biometric_id
│   ├── medical_history
│   ├── last_visit_date
│   └── created_at
│
├── 💓 vitals
│   ├── id (PRIMARY KEY)
│   ├── patient_id (FOREIGN KEY)
│   ├── bp_sys
│   ├── bp_dia
│   ├── pulse
│   ├── spo2
│   ├── temperature
│   └── timestamp
│
├── 📋 consultations
│   ├── id (PRIMARY KEY)
│   ├── patient_id (FOREIGN KEY)
│   ├── symptoms (JSON)
│   ├── diagnosis
│   ├── treatment
│   ├── medications (JSON)
│   ├── advice
│   ├── doctor_notes
│   └── date
│
├── 🩺 diseases
│   ├── id (PRIMARY KEY)
│   ├── name (UNIQUE)
│   ├── symptoms (JSON)
│   ├── vital_indicators (JSON)
│   ├── medications (JSON)
│   ├── advice
│   ├── followup
│   ├── referral_triggers (JSON)
│   └── created_at
│
├── ⚙️ settings
│   ├── key (PRIMARY KEY)
│   ├── value
│   └── updated_at
│
└── 📝 audit_log
    ├── id (PRIMARY KEY)
    ├── action
    ├── patient_id
    ├── details
    └── timestamp
```

---

## 🔄 Component Hierarchy

```
App (Dashboard Container)
│
├── Header
│   ├── Logo & Title
│   ├── Mode Indicator
│   ├── Patient Info Display
│   ├── Change Patient Button
│   └── Logout Button
│
├── PatientModal
│   ├── Search Tab
│   │   ├── Search Input
│   │   └── Patient List
│   └── Registration Tab
│       ├── Name Input
│       ├── Age Input
│       ├── Gender Select
│       ├── Contact Input
│       └── Medical History Textarea
│
├── Patient Info Card
│   ├── ID
│   ├── Age
│   ├── Gender
│   ├── Contact
│   ├── Last Visit
│   └── Medical History
│
├── VitalSignsPanel
│   ├── Header (Refresh, Auto-refresh toggle)
│   ├── Mode Indicator
│   └── Vital Cards Grid (5 columns)
│       ├── Blood Pressure Card
│       ├── Pulse Card
│       ├── SpO2 Card
│       ├── Temperature Card
│       └── Status/Time Card
│
├── ConsultationModule
│   ├── Left Column
│   │   ├── Symptom Input
│   │   ├── Symptoms List
│   │   └── Doctor Notes
│   └── Right Column
│       ├── Suggested Diagnosis
│       ├── Medications
│       ├── Advice
│       ├── Follow-up
│       └── Referral Triggers
│
├── HistoryAndReports
│   ├── Tabs
│   │   ├── Vitals History Tab
│   │   └── Consultations Tab
│   ├── Export Buttons
│   │   ├── PDF Export
│   │   └── CSV Export
│   └── Content Area
│
└── Footer
    └── Status & Copyright
```

---

## 🔌 API Route Structure

```
/api
├── /auth
│   ├── POST   /login           → Authenticate user
│   ├── GET    /mode            → Get current mode
│   └── POST   /mode            → Change operation mode
│
├── /patients
│   ├── GET    /                → List all patients
│   ├── GET    /:id             → Get patient details
│   ├── GET    /search/:query   → Search patients
│   ├── POST   /                → Create new patient
│   └── PUT    /:id             → Update patient
│
├── /vitals
│   ├── GET    /patient/:id     → Get vitals history
│   ├── GET    /latest/:id      → Get latest vitals
│   ├── GET    /summary/:id     → Get 30-day summary
│   └── POST   /                → Record new vitals
│
├── /consultations
│   ├── GET    /patient/:id     → Get patient consultations
│   ├── GET    /:id             → Get consultation details
│   └── POST   /                → Create consultation
│
├── /diseases
│   ├── GET    /                → List all diseases
│   ├── GET    /:id             → Get disease details
│   └── GET    /search/:query   → Search diseases
│
├── /settings
│   ├── GET    /                → Get all settings
│   ├── GET    /:key            → Get setting value
│   └── POST   /:key            → Update setting
│
└── /health
    └── GET   /                → Server status
```

---

## 📦 Dependencies

### Frontend (client/package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "html2pdf": "^0.10.1",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "sqlite3": "^5.1.6",
    "sqlite": "^5.1.1",
    "uuid": "^9.0.1",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 🎯 Key File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| App.jsx | 200+ | Main dashboard |
| VitalSignsPanel.jsx | 150+ | Vitals monitoring |
| ConsultationModule.jsx | 180+ | Consultation UI |
| api.js | 100+ | API client methods |
| server/index.js | 80+ | Express setup |
| auth.js | 90+ | Auth routes |
| patients.js | 120+ | Patient routes |
| seedDb.js | 200+ | Sample data |

---

## 🚀 Startup Flow

```
User starts application
    ↓
npm run dev
    ↓
Frontend (Vite) starts on :3000
    ↓
Backend (Express) starts on :5000
    ↓
Browser opens http://localhost:3000
    ↓
LoginPage.jsx loads
    ↓
User enters credentials
    ↓
Auth API call to /api/auth/login
    ↓
Backend validates & returns token
    ↓
PatientModal appears
    ↓
User selects patient
    ↓
App.jsx main dashboard loads
    ↓
VitalSignsPanel auto-fetches and refreshes
    ↓
Full application ready
```

---

## 📈 Database Growth

### Initial Setup (Post-Seeding)
- 1 admin user
- 10 dummy patients
- 15 diseases
- 0 vitals records
- 0 consultations
- Total: ~26 records

### After Testing (Estimated)
- Same users/patients/diseases
- ~100+ vitals records (auto-refreshing)
- ~20+ consultation records
- ~50+ audit log entries
- Total: ~200+ records

### With Real Data (Production)
- Depends on deployment scale
- Daily vitals: ~50-100 per patient
- Consultations: ~10-20 per patient
- Years of data: Minimal disk space (~100MB for 1000 patients)

---

## 🔐 Security Layers

```
Request Flow
    ↓
CORS Check (Express middleware)
    ↓
Error Handler (Catch exceptions)
    ↓
Route Handler
    ↓
Database Query (Parameterized - prevents SQL injection)
    ↓
Response JSON
    ↓
Sanitized Error Messages (No stack traces in production)
```

---

## 📱 Responsive Breakpoints

```css
/* Tablet (10" - Primary Target) */
@media (min-width: 768px) {
  /* Optimized layout */
}

/* Mobile (Secondary) */
@media (max-width: 767px) {
  /* Mobile-friendly adjustments */
}

/* Desktop (Development/Admin) */
@media (min-width: 1024px) {
  /* Full-size displays */
}
```

---

## 🎨 Color Scheme

```
Primary: Blue (#2563eb)
├── Dark Blue: #1e40af (hover states)
└── Light Blue: #dbeafe (backgrounds)

Status Colors:
├── Success/Normal: Green (#16a34a)
├── Warning: Yellow (#ea8f42)
└── Critical: Red (#dc2626)

Neutral:
├── Text: Gray (#1f2937)
├── Borders: Gray (#d1d5db)
└── Background: Gray (#f3f4f6)
```

---

**Complete project structure documented and ready for deployment! 🎉**
