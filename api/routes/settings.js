import { Router } from 'express';
import { getDatabase } from '../db.js';

const router = Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const settings = await db.all('SELECT * FROM settings');

    const obj = {};
    settings.forEach(s => {
      obj[s.key] = s.value;
    });

    res.json({ success: true, data: obj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const db = await getDatabase();
    const setting = await db.get(
      'SELECT value FROM settings WHERE key = ?',
      [req.params.key]
    );

    res.json({
      success: true,
      data: { key: req.params.key, value: setting?.value || null }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update setting
router.post('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const db = await getDatabase();

    await db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [req.params.key, value]
    );

    res.json({ success: true, data: { key: req.params.key, value } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
