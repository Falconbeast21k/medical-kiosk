import { initializeDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

// Disease database with comprehensive treatment protocols
const diseases = [
  {
    name: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'chest pain'],
    vital_indicators: { bp_sys: '>140', bp_dia: '>90' },
    medications: ['Amlodipine 5mg OD', 'Lisinopril 10mg OD'],
    advice: 'Low salt diet, regular exercise, stress management',
    followup: '2 weeks',
    referral_triggers: ['BP >180/110', 'Chest pain', 'Severe headache']
  },
  {
    name: 'Diabetes Mellitus',
    symptoms: ['excessive thirst', 'frequent urination', 'fatigue', 'blurred vision'],
    vital_indicators: {},
    medications: ['Metformin 500mg BD', 'Glipizide 5mg OD'],
    advice: 'Regular exercise, balanced diet, monitor blood glucose',
    followup: '1 month',
    referral_triggers: ['Uncontrolled glucose', 'Diabetic complications']
  },
  {
    name: 'Common Cold',
    symptoms: ['cough', 'sneezing', 'sore throat', 'runny nose'],
    vital_indicators: { temperature: '98.6-100.4' },
    medications: ['Paracetamol 500mg TDS', 'Cough syrup 10ml TDS'],
    advice: 'Rest, fluids, steam inhalation, warm soup',
    followup: '1 week',
    referral_triggers: ['Persistent fever >3 days', 'Difficulty breathing']
  },
  {
    name: 'Fever',
    symptoms: ['high body temperature', 'chills', 'sweating', 'body ache'],
    vital_indicators: { temperature: '>100.4' },
    medications: ['Paracetamol 650mg TDS', 'Ibuprofen 400mg TDS'],
    advice: 'Rest, hydration, tepid sponging, light clothing',
    followup: '3-5 days',
    referral_triggers: ['Fever >3 days', 'Seizures', 'Confusion']
  },
  {
    name: 'Gastritis',
    symptoms: ['stomach pain', 'nausea', 'vomiting', 'indigestion'],
    vital_indicators: {},
    medications: ['Ranitidine 150mg BD', 'Omeprazole 20mg OD'],
    advice: 'Bland diet, avoid spicy foods, small frequent meals',
    followup: '1 week',
    referral_triggers: ['Severe pain', 'Vomiting blood', 'Black stools']
  },
  {
    name: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'photophobia', 'vomiting'],
    vital_indicators: {},
    medications: ['Sumatriptan 50mg OD', 'Propranolol 40mg BD'],
    advice: 'Rest in dark room, avoid triggers, stress management',
    followup: '1 month',
    referral_triggers: ['Severe persistent headache', 'Change in pattern']
  },
  {
    name: 'Asthma',
    symptoms: ['shortness of breath', 'cough', 'wheezing', 'chest tightness'],
    vital_indicators: { spo2: '<95%' },
    medications: ['Albuterol inhaler PRN', 'Fluticasone inhaler OD'],
    advice: 'Avoid triggers, regular inhaler use, clean environment',
    followup: '2 weeks',
    referral_triggers: ['Severe breathing difficulty', 'Unresponsive to inhaler']
  },
  {
    name: 'Urinary Tract Infection',
    symptoms: ['dysuria', 'frequency', 'urgency', 'lower abdominal pain'],
    vital_indicators: {},
    medications: ['Ciprofloxacin 500mg BD', 'Nitrofurantoin 100mg BD'],
    advice: 'Hydration, cranberry juice, personal hygiene',
    followup: '1 week',
    referral_triggers: ['Fever with UTI', 'Persistent symptoms']
  },
  {
    name: 'Allergic Rhinitis',
    symptoms: ['nasal congestion', 'sneezing', 'itchy eyes', 'rhinorrhea'],
    vital_indicators: {},
    medications: ['Cetirizine 10mg OD', 'Fluticasone nasal spray'],
    advice: 'Avoid allergens, use saline nasal drops, air purifier',
    followup: '2 weeks',
    referral_triggers: ['Severe symptoms', 'Asthma development']
  },
  {
    name: 'Anxiety Disorder',
    symptoms: ['nervousness', 'panic', 'insomnia', 'palpitations'],
    vital_indicators: { pulse: '>100' },
    medications: ['Sertraline 50mg OD', 'Alprazolam 0.5mg BD PRN'],
    advice: 'Meditation, regular exercise, counseling, stress management',
    followup: '2 weeks',
    referral_triggers: ['Severe anxiety', 'Suicidal thoughts']
  },
  {
    name: 'Constipation',
    symptoms: ['infrequent bowel movements', 'hard stools', 'abdominal discomfort'],
    vital_indicators: {},
    medications: ['Lactulose 15ml OD', 'Ispaghula husk 7g BD'],
    advice: 'High fiber diet, adequate water intake, physical activity',
    followup: '1 week',
    referral_triggers: ['Blood in stool', 'Severe pain', 'Obstruction signs']
  },
  {
    name: 'Diarrhea',
    symptoms: ['loose stools', 'abdominal cramps', 'dehydration'],
    vital_indicators: {},
    medications: ['Loperamide 2mg TDS', 'Oral rehydration solution'],
    advice: 'Clear fluids, bland diet, electrolyte replacement',
    followup: '3-5 days',
    referral_triggers: ['Severe dehydration', 'Bloody stools', 'Persistent >7 days']
  },
  {
    name: 'Influenza',
    symptoms: ['high fever', 'cough', 'body ache', 'fatigue'],
    vital_indicators: { temperature: '>101.5' },
    medications: ['Oseltamivir 75mg BD', 'Paracetamol 650mg TDS'],
    advice: 'Bed rest, hydration, isolation, steam inhalation',
    followup: '1 week',
    referral_triggers: ['Respiratory distress', 'High-risk patients']
  },
  {
    name: 'Anemia',
    symptoms: ['fatigue', 'weakness', 'shortness of breath', 'pale skin'],
    vital_indicators: { pulse: '>100' },
    medications: ['Ferrous sulfate 325mg OD', 'Vitamin B12 injections'],
    advice: 'Iron-rich diet, vitamin supplements, regular exercise',
    followup: '4 weeks',
    referral_triggers: ['Severe symptoms', 'Underlying cause investigation']
  },
  {
    name: 'Insomnia',
    symptoms: ['difficulty sleeping', 'early awakening', 'daytime fatigue'],
    vital_indicators: {},
    medications: ['Melatonin 5mg OD', 'Zolpidem 5mg HS PRN'],
    advice: 'Sleep hygiene, avoid caffeine, relaxation techniques',
    followup: '2 weeks',
    referral_triggers: ['Persistent despite treatment', 'Daytime dysfunction']
  }
];

// Dummy patients for testing
const dummyPatients = [
  { name: 'Raj Kumar', age: 45, gender: 'M', contact: '9876543210', medical_history: 'Hypertension, Diabetes' },
  { name: 'Priya Singh', age: 38, gender: 'F', contact: '9876543211', medical_history: 'Asthma' },
  { name: 'Arun Verma', age: 52, gender: 'M', contact: '9876543212', medical_history: 'Heart disease' },
  { name: 'Neha Patel', age: 29, gender: 'F', contact: '9876543213', medical_history: 'None' },
  { name: 'Vikram Desai', age: 61, gender: 'M', contact: '9876543214', medical_history: 'Diabetes, Hypertension' },
  { name: 'Anjali Reddy', age: 35, gender: 'F', contact: '9876543215', medical_history: 'Allergic Rhinitis' },
  { name: 'Rohit Sharma', age: 41, gender: 'M', contact: '9876543216', medical_history: 'Gastritis' },
  { name: 'Divya Nair', age: 33, gender: 'F', contact: '9876543217', medical_history: 'Migraine' },
  { name: 'Suresh Menon', age: 58, gender: 'M', contact: '9876543218', medical_history: 'Hypertension' },
  { name: 'Sneha Gupta', age: 28, gender: 'F', contact: '9876543219', medical_history: 'None' }
];

async function seedDatabase() {
  try {
    const db = await initializeDatabase();

    // Add admin user
    const adminId = uuidv4();
    const passwordHash = await bcryptjs.hash('admin123', 10);
    await db.run(
      'INSERT OR IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [adminId, 'admin', passwordHash, 'admin']
    );

    // Add diseases
    for (const disease of diseases) {
      const id = uuidv4();
      await db.run(
        `INSERT OR IGNORE INTO diseases 
         (id, name, symptoms, vital_indicators, medications, advice, followup, referral_triggers) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          disease.name,
          JSON.stringify(disease.symptoms),
          JSON.stringify(disease.vital_indicators),
          JSON.stringify(disease.medications),
          disease.advice,
          disease.followup,
          JSON.stringify(disease.referral_triggers)
        ]
      );
    }

    // Add dummy patients
    for (const patient of dummyPatients) {
      const id = 'PAT-' + uuidv4().substring(0, 8).toUpperCase();
      await db.run(
        `INSERT OR IGNORE INTO patients 
         (id, name, age, gender, contact, medical_history, last_visit_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          patient.name,
          patient.age,
          patient.gender,
          patient.contact,
          patient.medical_history,
          new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        ]
      );
    }

    // Add setting for mode
    await db.run(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      ['operation_mode', 'dummy']
    );

    console.log('✓ Database seeded successfully');
    console.log('  - Admin user created (username: admin, password: admin123)');
    console.log(`  - ${diseases.length} diseases added to database`);
    console.log(`  - ${dummyPatients.length} dummy patients created`);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
