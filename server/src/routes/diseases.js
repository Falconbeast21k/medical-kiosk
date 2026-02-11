import { Router } from 'express';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all diseases
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const diseases = await db.all('SELECT * FROM diseases ORDER BY name');

    const formattedDiseases = diseases.map(d => ({
      ...d,
      symptoms: d.symptoms ? JSON.parse(d.symptoms) : [],
      vital_indicators: d.vital_indicators ? JSON.parse(d.vital_indicators) : {},
      medications: d.medications ? JSON.parse(d.medications) : [],
      referral_triggers: d.referral_triggers ? JSON.parse(d.referral_triggers) : []
    }));

    res.json({ success: true, data: formattedDiseases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search diseases by name or symptoms
router.get('/search/:query', async (req, res) => {
  try {
    const db = await getDatabase();
    const query = `%${req.params.query}%`;

    const diseases = await db.all(
      `SELECT * FROM diseases WHERE name LIKE ? OR symptoms LIKE ? ORDER BY name`,
      [query, query]
    );

    const formattedDiseases = diseases.map(d => ({
      ...d,
      symptoms: d.symptoms ? JSON.parse(d.symptoms) : [],
      vital_indicators: d.vital_indicators ? JSON.parse(d.vital_indicators) : {},
      medications: d.medications ? JSON.parse(d.medications) : [],
      referral_triggers: d.referral_triggers ? JSON.parse(d.referral_triggers) : []
    }));

    res.json({ success: true, data: formattedDiseases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get disease by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const disease = await db.get(
      'SELECT * FROM diseases WHERE id = ?',
      [req.params.id]
    );

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found' });
    }

    const formatted = {
      ...disease,
      symptoms: disease.symptoms ? JSON.parse(disease.symptoms) : [],
      vital_indicators: disease.vital_indicators ? JSON.parse(disease.vital_indicators) : {},
      medications: disease.medications ? JSON.parse(disease.medications) : [],
      referral_triggers: disease.referral_triggers ? JSON.parse(disease.referral_triggers) : []
    };

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
