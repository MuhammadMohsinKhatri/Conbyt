import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin, requireRole } from '../../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users ORDER BY username ASC'
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!role || !['admin', 'task_manager', 'task_creator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, task_manager, or task_creator' });
    }
    
    // Don't allow changing the last admin's role
    if (role !== 'admin') {
      const [admins] = await pool.execute(
        'SELECT COUNT(*) as count FROM admin_users WHERE role = "admin"'
      );
      const [currentUser] = await pool.execute(
        'SELECT role FROM admin_users WHERE id = ?',
        [userId]
      );
      
      if (admins[0].count === 1 && currentUser[0]?.role === 'admin') {
        return res.status(400).json({ error: 'Cannot remove the last admin user' });
      }
    }
    
    await pool.execute(
      'UPDATE admin_users SET role = ? WHERE id = ?',
      [role, userId]
    );
    
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users WHERE id = ?',
      [userId]
    );
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get single user
router.get('/:id', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

