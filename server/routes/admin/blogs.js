import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all blog posts (admin view)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id]
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

// Create new blog post
router.post('/', async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      image_url,
      category,
      author_name,
      author_avatar,
      date,
      read_time,
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      og_image,
      canonical_url,
      published,
      featured
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO blog_posts (
        title, excerpt, content, image_url, category, author_name, author_avatar,
        date, read_time, slug, meta_title, meta_description, meta_keywords,
        og_image, canonical_url, published, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, excerpt || null, content, image_url || null, category || null,
        author_name || null, author_avatar || null, date || new Date().toISOString().split('T')[0],
        read_time || null, slug, meta_title || null, meta_description || null,
        meta_keywords || null, og_image || null, canonical_url || null,
        published || false, featured || false
      ]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      image_url,
      category,
      author_name,
      author_avatar,
      date,
      read_time,
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      og_image,
      canonical_url,
      published,
      featured
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    await pool.execute(
      `UPDATE blog_posts SET
        title = ?, excerpt = ?, content = ?, image_url = ?, category = ?,
        author_name = ?, author_avatar = ?, date = ?, read_time = ?, slug = ?,
        meta_title = ?, meta_description = ?, meta_keywords = ?,
        og_image = ?, canonical_url = ?, published = ?, featured = ?
      WHERE id = ?`,
      [
        title, excerpt || null, content, image_url || null, category || null,
        author_name || null, author_avatar || null, date || new Date().toISOString().split('T')[0],
        read_time || null, slug, meta_title || null, meta_description || null,
        meta_keywords || null, og_image || null, canonical_url || null,
        published || false, featured || false, id
      ]
    );

    res.json({ success: true, message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;

