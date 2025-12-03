import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all case studies
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM case_studies ORDER BY created_at DESC'
    );
    
    // Parse JSON fields
    const caseStudies = rows.map(row => ({
      ...row,
      tech: row.tech_stack ? JSON.parse(row.tech_stack) : []
    }));
    
    res.json(caseStudies);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
});

// Get case study by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM case_studies WHERE slug = ?',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    
    const caseStudy = {
      ...rows[0],
      tech: rows[0].tech_stack ? JSON.parse(rows[0].tech_stack) : []
    };
    
    res.json(caseStudy);
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({ error: 'Failed to fetch case study' });
  }
});

export default router;

