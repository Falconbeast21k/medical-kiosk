import { Router } from 'express';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const patients = await db.all('SELECT * FROM patients ORDER BY name');
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get patient by ID with vitals and consultations
router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const patient = await db.get(
      'SELECT * FROM patients WHERE id = ?',
      [req.params.id]
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const vitals = await db.all(
      'SELECT * FROM vitals WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 10',
      [req.params.id]
    );

    const consultations = await db.all(
      'SELECT * FROM consultations WHERE patient_id = ? ORDER BY date DESC LIMIT 5',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...patient,
        vitals: vitals.map(v => ({
          ...v,
          vital_indicators: v.vital_indicators ? JSON.parse(v.vital_indicators) : {}
        })),
        consultations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search patients by name or ID
router.get('/search/:query', async (req, res) => {
  try {
    const db = await getDatabase();
    const query = `%${req.params.query}%`;
    const patients = await db.all(
      'SELECT * FROM patients WHERE name LIKE ? OR id LIKE ? ORDER BY name',
      [query, query]
    );

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, contact, medical_history } = req.body;

    if (!name || !age) {
      return res.status(400).json({ success: false, message: 'Name and age required' });
    }

    const db = await getDatabase();
    const id = 'PAT-' + uuidv4().substring(0, 8).toUpperCase();

    await db.run(
      `INSERT INTO patients (id, name, age, gender, contact, medical_history) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, age, gender || null, contact || null, medical_history || null]
    );

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { id, name, age, gender, contact, medical_history }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { name, age, gender, contact, medical_history } = req.body;
    const db = await getDatabase();

    await db.run(
      `UPDATE patients SET name = ?, age = ?, gender = ?, contact = ?, medical_history = ? 
       WHERE id = ?`,
      [name, age, gender, contact, medical_history, req.params.id]
    );

    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
