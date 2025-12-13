import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all portfolios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, description, image_url, category, tech_stack, slug, featured, display_order, live_url, github_url, created_at 
       FROM portfolios 
       ORDER BY display_order ASC, created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// Get single portfolio by slug or ID
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if it's an ID or slug
    const isId = /^\d+$/.test(slug);
    const query = isId 
      ? 'SELECT * FROM portfolios WHERE id = ?'
      : 'SELECT * FROM portfolios WHERE slug = ?';
      
    const [rows] = await pool.execute(query, [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Fetch related portfolios (same category or just random others)
    const portfolio = rows[0];
    let relatedPosts = [];
    
    if (portfolio.category) {
        const [related] = await pool.execute(
            `SELECT id, title, image_url, slug, description FROM portfolios 
             WHERE category = ? AND id != ? 
             LIMIT 3`,
            [portfolio.category, portfolio.id]
        );
        relatedPosts = related;
    } else {
        const [related] = await pool.execute(
            `SELECT id, title, image_url, slug, description FROM portfolios 
             WHERE id != ? 
             ORDER BY RAND() 
             LIMIT 3`,
            [portfolio.id]
        );
        relatedPosts = related;
    }
    
    res.json({ ...portfolio, relatedPosts });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

export default router;

