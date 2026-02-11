// Dummy data generator for testing in dummy mode
const DummyDataGenerator = {
  // Generate realistic vital ranges
  generateVitals() {
    return {
      bp_sys: Math.floor(Math.random() * 50 + 100), // 100-150
      bp_dia: Math.floor(Math.random() * 30 + 65), // 65-95
      pulse: Math.floor(Math.random() * 40 + 60), // 60-100
      spo2: Math.random() * 5 + 95, // 95-100%
      temperature: parseFloat((Math.random() * 2.5 + 97).toFixed(1)), // 97-99.5°F
      timestamp: new Date().toISOString()
    };
  },

  // Generate multiple vital readings for history
  generateVitalHistory(count = 10) {
    const history = [];
    const now = new Date();
    for (let i = count; i > 0; i--) {
      const time = new Date(now - i * 5 * 60 * 1000); // 5 minute intervals
      history.push({
        ...this.generateVitals(),
        timestamp: time.toISOString()
      });
    }
    return history;
  },

  // Generate dummy consultation data
  generateConsultation(symptoms = []) {
    const consultations = [
      {
        diagnosis: 'Essential Hypertension',
        treatment: 'Lifestyle modification and medication',
        medications: ['Amlodipine 5mg OD', 'Lisinopril 10mg OD']
      },
      {
        diagnosis: 'Common Cold',
        treatment: 'Symptomatic management',
        medications: ['Paracetamol 500mg TDS', 'Cough syrup 10ml TDS']
      },
      {
        diagnosis: 'Fever (Viral)',
        treatment: 'Rest and hydration',
        medications: ['Paracetamol 650mg TDS']
      }
    ];

    return consultations[Math.floor(Math.random() * consultations.length)];
  },

  // Generate dummy patient list
  generateDummyPatients() {
    const firstNames = ['Raj', 'Priya', 'Arun', 'Neha', 'Vikram', 'Anjali'];
    const lastNames = ['Kumar', 'Singh', 'Verma', 'Patel', 'Desai', 'Reddy'];
    const patients = [];

    for (let i = 0; i < 10; i++) {
      patients.push({
        id: `PAT-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        age: Math.floor(Math.random() * 50 + 20),
        gender: Math.random() > 0.5 ? 'M' : 'F',
        contact: `98${Math.floor(Math.random() * 10000000000)}`,
        medical_history: 'Hypertension, Diabetes',
        last_visit_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return patients;
  }
};

export default DummyDataGenerator;
