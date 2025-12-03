import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all blog posts (only published)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts WHERE published = true ORDER BY date DESC, created_at DESC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get blog post by slug (only published)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts WHERE slug = ? AND published = true',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

export default router;

