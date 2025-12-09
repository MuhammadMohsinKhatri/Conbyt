import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all portfolios with project information
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, pr.title as project_title, pr.client_id,
       c.name as client_name, c.company as client_company
       FROM portfolios p
       LEFT JOIN projects pr ON p.project_id = pr.id
       LEFT JOIN clients c ON pr.client_id = c.id
       ORDER BY p.display_order ASC, p.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// Get single portfolio by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT p.*, pr.title as project_title, pr.client_id
       FROM portfolios p
       LEFT JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug) {
  if (!baseSlug) return null;
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const [existing] = await pool.execute(
      'SELECT id FROM portfolios WHERE slug = ?',
      [slug]
    );
    
    if (existing.length === 0) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Helper function to generate unique slug excluding a specific ID
async function generateUniqueSlugExcluding(baseSlug, excludeId) {
  if (!baseSlug) return null;
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const [existing] = await pool.execute(
      'SELECT id FROM portfolios WHERE slug = ? AND id != ?',
      [slug, excludeId]
    );
    
    if (existing.length === 0) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Create new portfolio
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      image_url,
      category,
      tech_stack,
      slug,
      featured,
      display_order,
      live_url,
      github_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Generate unique slug if provided
    const uniqueSlug = slug ? await generateUniqueSlug(slug) : null;

    const [result] = await pool.execute(
      `INSERT INTO portfolios (project_id, title, description, image_url, category, tech_stack, slug, featured, display_order, live_url, github_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        title,
        description || null,
        image_url || null,
        category || null,
        tech_stack ? JSON.stringify(tech_stack) : null,
        uniqueSlug,
        featured || false,
        display_order || 0,
        live_url || null,
        github_url || null
      ]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      slug: uniqueSlug,
      message: 'Portfolio created successfully'
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

// Update portfolio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project_id,
      title,
      description,
      image_url,
      category,
      tech_stack,
      slug,
      featured,
      display_order,
      live_url,
      github_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Check if slug is being changed and if it conflicts with existing ones
    let finalSlug = slug;
    if (slug) {
      const [existing] = await pool.execute(
        'SELECT id FROM portfolios WHERE slug = ? AND id != ?',
        [slug, id]
      );
      
      if (existing.length > 0) {
        // Generate unique slug excluding current record
        finalSlug = await generateUniqueSlugExcluding(slug, id);
      }
    }

    await pool.execute(
      `UPDATE portfolios SET
        project_id = ?, title = ?, description = ?, image_url = ?,
        category = ?, tech_stack = ?, slug = ?, featured = ?,
        display_order = ?, live_url = ?, github_url = ?
      WHERE id = ?`,
      [
        project_id || null,
        title,
        description || null,
        image_url || null,
        category || null,
        tech_stack ? JSON.stringify(tech_stack) : null,
        finalSlug || null,
        featured || false,
        display_order || 0,
        live_url || null,
        github_url || null,
        id
      ]
    );

    res.json({ 
      success: true, 
      slug: finalSlug,
      message: 'Portfolio updated successfully' 
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Delete portfolio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM portfolios WHERE id = ?', [id]);
    res.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

export default router;

