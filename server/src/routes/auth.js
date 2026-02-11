import { Router } from 'express';
import { getDatabase } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password, mode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const db = await getDatabase();
    const user = await db.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update operation mode
    if (mode) {
      await db.run(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        ['operation_mode', mode]
      );
    }

    // Create session token (simple implementation)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token,
      mode: mode || 'dummy'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current mode
router.get('/mode', async (req, res) => {
  try {
    const db = await getDatabase();
    const setting = await db.get(
      'SELECT value FROM settings WHERE key = ?',
      ['operation_mode']
    );

    res.json({
      success: true,
      mode: setting?.value || 'dummy'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update mode
router.post('/mode', async (req, res) => {
  try {
    const { mode } = req.body;

    if (!['dummy', 'practical'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Invalid mode' });
    }

    const db = await getDatabase();
    await db.run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['operation_mode', mode]
    );

    res.json({ success: true, message: `Mode switched to ${mode}`, mode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
