# Medical Kiosk - Patient Management System

A comprehensive web-based medical kiosk application for patient vital signs monitoring, consultation management, and disease treatment protocols. Supports both **DUMMY MODE** (for testing/demo) and **PRACTICAL MODE** (for real hardware integration).

## Features

✅ **Authentication & Mode Selection**
- Secure admin login
- Mode toggle: Dummy (simulated data) / Practical (real device integration)

✅ **Patient Management**
- Patient registration and search
- Medical history tracking
- Last visit date display

✅ **Vital Signs Monitoring**
- Real-time vital signs display:
  - Blood Pressure (Systolic/Diastolic)
  - Pulse/Heart Rate (BPM)
  - Oxygen Saturation (SpO2 %)
  - Body Temperature (°F/°C)
- Color-coded alerts (Green: Normal, Yellow: Warning, Red: Critical)
- Auto-refresh every 5 seconds

✅ **Consultation Module**
- Symptom checker with searchable input
- AI-powered diagnosis suggestion based on symptoms
- Treatment protocol recommendations:
  - Medications with dosage
  - Lifestyle advice
  - Follow-up schedule
  - Doctor referral triggers

✅ **Disease Database**
- 15+ common medical conditions
- Comprehensive treatment protocols
- Symptom-to-diagnosis mapping

✅ **History & Reports**
- Patient visit history timeline
- Vital signs trends
- Consultation records
- CSV export functionality
- PDF report generation

✅ **Additional Features**
- Auto-logout after 5 minutes of inactivity
- Touch-friendly UI for 10" tablets
- Offline-first with SQLite database
- HIPAA-compliant audit logging
- Responsive tablet design

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### Backend
- **Node.js/Express** - Server framework
- **SQLite3** - Database
- **Bcryptjs** - Password hashing
- **UUID** - ID generation

## Project Structure

```
medical-kiosk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API & utilities
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Tailwind styles
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── controllers/   # Business logic
│   │   ├── db.js          # Database connection
│   │   └── index.js       # Server entry point
│   │
│   └── scripts/
│       ├── initDb.js      # Database initialization
│       └── seedDb.js      # Sample data seeding
│
└── database/              # SQLite database file
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Step 1: Clone/Download the Project
```bash
cd medical-kiosk
```

### Step 2: Install Dependencies
```bash
npm run install-all
```

This will install dependencies for both client and server.

### Step 3: Initialize Database
```bash
cd server
npm run db:init
npm run db:seed
```

This creates the SQLite database and seeds it with:
- Admin user (username: `admin`, password: `admin123`)
- 15 common diseases with treatment protocols
- 10 dummy patients for testing

### Step 4: Start the Application

**Option A: Development Mode (both frontend + backend)**
```bash
npm run dev
```

**Option B: Start Backend Only**
```bash
cd server
npm run dev
```

**Option C: Start Frontend Only**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Login
1. Use demo credentials:
   - Username: `admin`
   - Password: `admin123`
2. Select operation mode:
   - **Dummy Mode**: Uses simulated vital data (2-second delay)
   - **Practical Mode**: Connects to real medical devices via USB serial

### Patient Selection
1. Click "Select Patient" to search or create a patient
2. Existing patients can be searched by name or ID
3. New patients can be registered with name, age, gender, and medical history

### Monitoring Vitals
- Vital signs auto-refresh every 3-5 seconds
- Color indicators show status (normal/warning/critical)
- Manual refresh available via "Refresh" button

### Consultations
1. Add patient symptoms one by one
2. System auto-suggests diagnosis based on symptoms
3. View recommended medications, advice, and follow-up schedule
4. Add doctor notes
5. Save consultation to patient record

### Reports
- View patient vitals history (last 50 records)
- View consultation history
- Export vitals data as CSV
- Generate PDF reports

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login with mode selection
- `GET /api/auth/mode` - Get current operation mode
- `POST /api/auth/mode` - Change operation mode

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID with vitals and consultations
- `GET /api/patients/search/:query` - Search patients by name/ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient

### Vitals
- `GET /api/vitals/patient/:patientId` - Get vitals history
- `GET /api/vitals/latest/:patientId` - Get latest vitals
- `GET /api/vitals/summary/:patientId` - Get 30-day summary
- `POST /api/vitals` - Record new vital signs

### Consultations
- `GET /api/consultations/patient/:patientId` - Get patient consultations
- `GET /api/consultations/:id` - Get consultation by ID
- `POST /api/consultations` - Create new consultation

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get disease by ID
- `GET /api/diseases/search/:query` - Search diseases

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get setting by key
- `POST /api/settings/:key` - Update setting

## Dummy Mode Details

In DUMMY MODE, the application:
- Generates realistic vital signs within normal ranges:
  - BP: 110-150 / 65-95 mmHg
  - Pulse: 60-100 BPM
  - SpO2: 95-100%
  - Temperature: 97.0-99.5°F
- Simulates 2-second device response delay
- Uses 10 pre-loaded dummy patients
- Provides sample consultations and diagnoses
- Allows full testing of all features without real hardware

## Practical Mode Setup

For real device integration:
1. Connect USB medical devices to the kiosk
2. Configure serial port settings in Practical Mode
3. System will detect and collect data from:
   - BP monitor (serial protocol)
   - Pulse oximeter (serial protocol)
   - Thermometer (serial protocol)

## Database Schema

### Tables
- `users` - Admin accounts
- `patients` - Patient information
- `vitals` - Vital signs readings
- `consultations` - Consultation records
- `diseases` - Disease database with treatments
- `settings` - Application settings
- `audit_log` - Activity audit trail

## Security Features

✓ Password-protected admin login  
✓ Bcryptjs password hashing  
✓ SQLite database with foreign keys  
✓ Session management with localStorage  
✓ HIPAA compliance principles  
✓ Audit logging of all consultations  
✓ Auto-logout after inactivity  

## Deployment

### Docker (Optional)
```bash
docker build -t medical-kiosk .
docker run -p 3000:3000 -p 5000:5000 medical-kiosk
```

### Raspberry Pi + Tablet
1. Install Node.js on Raspberry Pi
2. Clone project
3. Run `npm run install-all`
4. Run database setup scripts
5. Start with `npm run dev`
6. Open frontend on tablet browser pointing to Raspberry Pi IP

## Testing Checklist

- [ ] Login with demo credentials
- [ ] Switch between Dummy and Practical modes
- [ ] Search and select existing patient
- [ ] Create new patient
- [ ] View vital signs auto-refresh
- [ ] Add symptoms and get diagnosis
- [ ] Save consultation
- [ ] View patient history
- [ ] Export vitals as CSV
- [ ] Test auto-logout after 5 minutes
- [ ] Verify color-coded vital status
- [ ] Check responsive design on tablet

## Troubleshooting

**Port already in use**
```bash
# Change ports in .env (server) and vite.config.js (client)
```

**Database not initializing**
```bash
cd server
rm database/medical_kiosk.db  # Delete old database
npm run db:init
npm run db:seed
```

**API not responding**
- Ensure backend is running on port 5000
- Check `/api/health` endpoint
- Verify CORS settings in server/src/index.js

## Future Enhancements

- 🎤 Voice feedback for illiterate patients
- 🌍 Multi-language support
- 🔐 Biometric authentication
- 📱 Mobile app
- ☁️ Cloud sync
- 🎥 Telemedicine integration
- 🧬 Advanced analytics
- 🤖 AI-powered diagnosis

## License

MIT License

## Support

For issues or questions, please refer to the documentation or contact support.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: ✅ Fully Functional - Dummy Mode Ready
