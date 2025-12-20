import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all blog posts (only published)
router.get('/', async (req, res) => {
  try {
    // Handle both boolean true and integer 1 for published field
    // Also handle NULL dates gracefully
    const [rows] = await pool.execute(
      `SELECT * FROM blog_posts 
       WHERE (published = true OR published = 1) 
       ORDER BY COALESCE(date, created_at) DESC, created_at DESC`
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to fetch blog posts';
    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Blog posts table does not exist. Please run database migrations.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Database connection failed. Please check your database configuration.';
    } else if (error.message) {
      errorMessage = `Database error: ${error.message}`;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get blog post by slug (only published)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Handle both boolean true and integer 1 for published field
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts WHERE slug = ? AND (published = true OR published = 1)',
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        error: 'Blog post not found',
        slug,
        message: 'The blog post may not exist or may not be published.'
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to fetch blog post';
    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Blog posts table does not exist. Please run database migrations.';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Database connection failed. Please check your database configuration.';
    } else if (error.message) {
      errorMessage = `Database error: ${error.message}`;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      code: error.code,
      slug: req.params.slug,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

