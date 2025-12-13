import express from 'express';
import pool from '../../config/database.js';
import { authenticateUser, requirePermission } from '../../middleware/auth.js';

const router = express.Router();

// Get all users with permissions (admin only)
router.get('/', authenticateUser, requirePermission('users', ['view']), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users ORDER BY username ASC'
    );
    
    // Fetch permissions for each user (handle missing table gracefully)
    const usersWithPermissions = await Promise.all(
      users.map(async (user) => {
        try {
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
        } catch (error) {
          // If table doesn't exist, return user without permissions
          if (error.code === 'ER_NO_SUCH_TABLE') {
            console.warn('⚠️  user_permissions table does not exist. Run migration: npm run migrate-user-permissions');
            return {
              ...user,
              permissions: {}
            };
          }
          throw error;
        }
      })
    );
    
    res.json(usersWithPermissions);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateUser, requirePermission('users', ['edit']), async (req, res) => {
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
router.get('/:id', authenticateUser, requirePermission('users', ['view']), async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM admin_users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch permissions (handle missing table gracefully)
    let permissionsMap = {};
    try {
      const [permissions] = await pool.execute(
        'SELECT section, permissions FROM user_permissions WHERE user_id = ?',
        [userId]
      );
      
      permissions.forEach(p => {
        permissionsMap[p.section] = JSON.parse(p.permissions);
      });
    } catch (error) {
      // If table doesn't exist, return empty permissions
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️  user_permissions table does not exist. Run migration: npm run migrate-user-permissions');
      } else {
        throw error;
      }
    }
    
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
router.put('/:id/permissions', authenticateUser, requirePermission('users', ['edit']), async (req, res) => {
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
    
    // Check if user_permissions table exists
    try {
      await pool.execute('SELECT 1 FROM user_permissions LIMIT 1');
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          error: 'Permissions table does not exist. Please run migration: npm run migrate-user-permissions' 
        });
      }
      throw error;
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
router.delete('/:id/permissions/:section', authenticateUser, requirePermission('users', ['delete']), async (req, res) => {
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

