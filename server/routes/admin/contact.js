import express from 'express';
import pool from '../../config/database.js';
import { authenticateUser, requirePermission } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication (now handled per-route with granular permissions)
// router.use(authenticateAdmin); // Removed as it's replaced by authenticateUser on each route

// Get all contact submissions
router.get('/', authenticateUser, requirePermission('contact', ['view']), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Get single contact submission by ID
router.get('/:id', authenticateUser, requirePermission('contact', ['view']), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM contact_submissions WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    res.status(500).json({ error: 'Failed to fetch contact submission' });
  }
});

// Delete contact submission
router.delete('/:id', authenticateUser, requirePermission('contact', ['delete']), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({ error: 'Failed to delete contact submission' });
  }
});

// Mark as read/unread
router.patch('/:id/read', authenticateUser, requirePermission('contact', ['edit']), async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    
    // Note: You might want to add a 'read' column to the table
    // For now, this is a placeholder
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({ error: 'Failed to update contact submission' });
  }
});

export default router;

