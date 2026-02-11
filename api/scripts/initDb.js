import { initializeDatabase } from '../db.js';

const schema = `
-- Users/Admin Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT,
  contact TEXT,
  biometric_id TEXT,
  medical_history TEXT,
  last_visit_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vitals Table
CREATE TABLE IF NOT EXISTS vitals (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  bp_sys INTEGER,
  bp_dia INTEGER,
  pulse INTEGER,
  spo2 REAL,
  temperature REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  advice TEXT,
  doctor_notes TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Diseases Database Table
CREATE TABLE IF NOT EXISTS diseases (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  symptoms TEXT,
  vital_indicators TEXT,
  medications TEXT,
  advice TEXT,
  followup TEXT,
  referral_triggers TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Session/Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  patient_id TEXT,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vitals_patient ON vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_vitals_timestamp ON vitals(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
`;

async function initDatabase() {
  try {
    const db = await initializeDatabase();
    
    // Execute schema
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      await db.exec(statement + ';');
    }
    
    console.log('✓ Database schema initialized successfully');
  } catch (error) {
    console.error('✗ Error initializing database:', error.message);
    process.exit(1);
  }
}

initDatabase();
