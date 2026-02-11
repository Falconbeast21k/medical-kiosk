import { Router } from 'express';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get vitals for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const db = await getDatabase();
    const vitals = await db.all(
      'SELECT * FROM vitals WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 50',
      [req.params.patientId]
    );

    res.json({ success: true, data: vitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get latest vitals for a patient
router.get('/latest/:patientId', async (req, res) => {
  try {
    const db = await getDatabase();
    const vital = await db.get(
      'SELECT * FROM vitals WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 1',
      [req.params.patientId]
    );

    res.json({ success: true, data: vital || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add vital signs
router.post('/', async (req, res) => {
  try {
    const { patient_id, bp_sys, bp_dia, pulse, spo2, temperature } = req.body;

    if (!patient_id) {
      return res.status(400).json({ success: false, message: 'Patient ID required' });
    }

    const db = await getDatabase();
    const id = uuidv4();

    await db.run(
      `INSERT INTO vitals (id, patient_id, bp_sys, bp_dia, pulse, spo2, temperature) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, patient_id, bp_sys, bp_dia, pulse, spo2, temperature]
    );

    // Update patient's last visit date
    await db.run(
      'UPDATE patients SET last_visit_date = CURRENT_TIMESTAMP WHERE id = ?',
      [patient_id]
    );

    res.status(201).json({
      success: true,
      message: 'Vital signs recorded successfully',
      data: { id, patient_id, bp_sys, bp_dia, pulse, spo2, temperature }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get vitals summary for patient (last 30 days)
router.get('/summary/:patientId', async (req, res) => {
  try {
    const db = await getDatabase();
    const vitals = await db.all(
      `SELECT * FROM vitals WHERE patient_id = ? AND timestamp > datetime('now', '-30 days')
       ORDER BY timestamp DESC`,
      [req.params.patientId]
    );

    // Calculate averages
    const summary = {
      total_readings: vitals.length,
      avg_bp_sys: vitals.length > 0 ? Math.round(vitals.reduce((sum, v) => sum + (v.bp_sys || 0), 0) / vitals.length) : null,
      avg_bp_dia: vitals.length > 0 ? Math.round(vitals.reduce((sum, v) => sum + (v.bp_dia || 0), 0) / vitals.length) : null,
      avg_pulse: vitals.length > 0 ? Math.round(vitals.reduce((sum, v) => sum + (v.pulse || 0), 0) / vitals.length) : null,
      avg_spo2: vitals.length > 0 ? (vitals.reduce((sum, v) => sum + (v.spo2 || 0), 0) / vitals.length).toFixed(1) : null,
      avg_temp: vitals.length > 0 ? (vitals.reduce((sum, v) => sum + (v.temperature || 0), 0) / vitals.length).toFixed(1) : null,
      latest: vitals[0] || null
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
