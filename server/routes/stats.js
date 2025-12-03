import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all stats
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM stats ORDER BY display_order ASC, id ASC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;

