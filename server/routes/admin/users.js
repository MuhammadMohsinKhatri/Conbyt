import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin, requireRole } from '../../middleware/auth.js';

const router = express.Router();

// Get all users with permissions (admin only)
router.get('/', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users ORDER BY username ASC'
    );
    
    // Fetch permissions for each user
    const usersWithPermissions = await Promise.all(
      users.map(async (user) => {
        const [permissions] = await pool.execute(
          'SELECT section, permissions FROM user_permissions WHERE user_id = ?',
          [user.id]
        );
        
        const permissionsMap = {};
        permissions.forEach(p => {
          permissionsMap[p.section] = JSON.parse(p.permissions);
        });
        
        return {
          ...user,
          permissions: permissionsMap
        };
      })
    );
    
    res.json(usersWithPermissions);
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

// Get single user with permissions
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
    
    // Fetch permissions
    const [permissions] = await pool.execute(
      'SELECT section, permissions FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    
    const permissionsMap = {};
    permissions.forEach(p => {
      permissionsMap[p.section] = JSON.parse(p.permissions);
    });
    
    res.json({
      ...users[0],
      permissions: permissionsMap
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user permissions (admin only)
router.put('/:id/permissions', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { permissions } = req.body;
    
    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({ error: 'Invalid permissions format' });
    }
    
    // Validate user exists
    const [users] = await pool.execute(
      'SELECT id FROM admin_users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update permissions for each section
    for (const [section, sectionPermissions] of Object.entries(permissions)) {
      if (Array.isArray(sectionPermissions)) {
        await pool.execute(
          `INSERT INTO user_permissions (user_id, section, permissions) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE permissions = VALUES(permissions), updated_at = CURRENT_TIMESTAMP`,
          [userId, section, JSON.stringify(sectionPermissions)]
        );
      }
    }
    
    // Fetch updated permissions
    const [updatedPermissions] = await pool.execute(
      'SELECT section, permissions FROM user_permissions WHERE user_id = ?',
      [userId]
    );
    
    const permissionsMap = {};
    updatedPermissions.forEach(p => {
      permissionsMap[p.section] = JSON.parse(p.permissions);
    });
    
    res.json({ success: true, permissions: permissionsMap });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

// Delete user permissions for a section
router.delete('/:id/permissions/:section', authenticateAdmin, requireRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const section = req.params.section;
    
    await pool.execute(
      'DELETE FROM user_permissions WHERE user_id = ? AND section = ?',
      [userId, section]
    );
    
    res.json({ success: true, message: 'Permissions removed' });
  } catch (error) {
    console.error('Error deleting permissions:', error);
    res.status(500).json({ error: 'Failed to delete permissions' });
  }
});

export default router;

