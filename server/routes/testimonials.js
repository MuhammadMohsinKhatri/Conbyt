import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

export default router;

