import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all milestones for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM milestones WHERE project_id = ? ORDER BY order_index ASC, created_at ASC',
      [projectId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

// Get single milestone by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM milestones WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching milestone:', error);
    res.status(500).json({ error: 'Failed to fetch milestone' });
  }
});

// Create new milestone
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      status,
      due_date,
      order_index
    } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({ error: 'Project ID and title are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO milestones (project_id, title, description, status, due_date, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        title,
        description || null,
        status || 'pending',
        due_date || null,
        order_index || 0
      ]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Milestone created successfully'
    });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Failed to create milestone' });
  }
});

// Update milestone
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      due_date,
      completed_date,
      order_index
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    await pool.execute(
      `UPDATE milestones SET
        title = ?, description = ?, status = ?,
        due_date = ?, completed_date = ?, order_index = ?
      WHERE id = ?`,
      [
        title,
        description || null,
        status || 'pending',
        due_date || null,
        completed_date || null,
        order_index || 0,
        id
      ]
    );

    res.json({ success: true, message: 'Milestone updated successfully' });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

// Delete milestone
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM milestones WHERE id = ?', [id]);
    res.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
});

export default router;

