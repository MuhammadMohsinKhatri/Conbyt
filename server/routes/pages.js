import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get page content by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if pages table exists, if not return 404 with helpful message
    // For now, return a structured error response
    res.status(404).json({ 
      error: `Page "${slug}" not found. The pages feature is not yet implemented.`,
      slug,
      message: 'This endpoint is available but page content needs to be configured.'
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

export default router;

