import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM services ORDER BY display_order ASC, id ASC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

export default router;

