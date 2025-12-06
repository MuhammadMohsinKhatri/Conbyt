import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all projects with client information
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as client_name, c.company as client_company
       FROM projects p
       LEFT JOIN clients c ON p.client_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID with client and milestones info
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await pool.execute(
      `SELECT p.*, c.name as client_name, c.company as client_company, c.email as client_email
       FROM projects p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = projects[0];
    
    // Get milestones for this project
    const [milestones] = await pool.execute(
      'SELECT * FROM milestones WHERE project_id = ? ORDER BY order_index ASC, created_at ASC',
      [id]
    );
    
    project.milestones = milestones;
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const {
      client_id,
      title,
      description,
      status,
      start_date,
      end_date,
      budget,
      tech_stack,
      category
    } = req.body;

    if (!client_id || !title) {
      return res.status(400).json({ error: 'Client ID and title are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO projects (client_id, title, description, status, start_date, end_date, budget, tech_stack, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        title,
        description || null,
        status || 'planning',
        start_date || null,
        end_date || null,
        budget || null,
        tech_stack ? JSON.stringify(tech_stack) : null,
        category || null
      ]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_id,
      title,
      description,
      status,
      start_date,
      end_date,
      budget,
      tech_stack,
      category
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    await pool.execute(
      `UPDATE projects SET
        client_id = ?, title = ?, description = ?, status = ?,
        start_date = ?, end_date = ?, budget = ?, tech_stack = ?, category = ?
      WHERE id = ?`,
      [
        client_id,
        title,
        description || null,
        status || 'planning',
        start_date || null,
        end_date || null,
        budget || null,
        tech_stack ? JSON.stringify(tech_stack) : null,
        category || null,
        id
      ]
    );

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;

