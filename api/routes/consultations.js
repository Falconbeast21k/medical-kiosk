import { Router } from 'express';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get consultations for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const db = await getDatabase();
    const consultations = await db.all(
      'SELECT * FROM consultations WHERE patient_id = ? ORDER BY date DESC',
      [req.params.patientId]
    );

    const formatted = consultations.map(c => ({
      ...c,
      symptoms: c.symptoms ? JSON.parse(c.symptoms) : [],
      medications: c.medications ? JSON.parse(c.medications) : []
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create consultation
router.post('/', async (req, res) => {
  try {
    const { patient_id, symptoms, diagnosis, treatment, medications, advice, doctor_notes } = req.body;

    if (!patient_id) {
      return res.status(400).json({ success: false, message: 'Patient ID required' });
    }

    const db = await getDatabase();
    const id = uuidv4();

    await db.run(
      `INSERT INTO consultations (id, patient_id, symptoms, diagnosis, treatment, medications, advice, doctor_notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        patient_id,
        symptoms ? JSON.stringify(symptoms) : null,
        diagnosis,
        treatment,
        medications ? JSON.stringify(medications) : null,
        advice,
        doctor_notes
      ]
    );

    // Log audit
    await db.run(
      'INSERT INTO audit_log (id, action, patient_id, details) VALUES (?, ?, ?, ?)',
      [uuidv4(), 'CONSULTATION_CREATED', patient_id, diagnosis]
    );

    res.status(201).json({
      success: true,
      message: 'Consultation recorded successfully',
      data: { id, patient_id, diagnosis }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get consultation by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const consultation = await db.get(
      'SELECT * FROM consultations WHERE id = ?',
      [req.params.id]
    );

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    const formatted = {
      ...consultation,
      symptoms: consultation.symptoms ? JSON.parse(consultation.symptoms) : [],
      medications: consultation.medications ? JSON.parse(consultation.medications) : []
    };

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
