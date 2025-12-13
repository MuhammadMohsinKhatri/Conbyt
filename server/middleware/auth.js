import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/database.js'; // Import the database connection

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authenticate user middleware
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user details from the database, including role
    const [users] = await pool.execute('SELECT id, username, email, role FROM admin_users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = users[0];

    // Fetch granular permissions for the user
    let permissionsMap = {};
    if (user.role !== 'admin') { // Admins have full access, no need to fetch granular permissions
      try {
        const [permissions] = await pool.execute(
          'SELECT section, permissions FROM user_permissions WHERE user_id = ?',
          [user.id]
        );
        permissions.forEach(p => {
          permissionsMap[p.section] = JSON.parse(p.permissions);
        });
      } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
          console.warn('⚠️  user_permissions table does not exist. Please run migration if needed.');
        } else {
          throw error;
        }
      }
    } else {
        // For admins, grant all possible permissions for all sections
        const sections = ['tasks', 'projects', 'clients', 'portfolios', 'blogs', 'payments', 'milestones', 'users']; // Define all sections here
        sections.forEach(section => {
            permissionsMap[section] = ['view', 'create', 'edit', 'delete'];
        });
    }

    req.user = { ...user, permissions: permissionsMap };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role || 'task_creator' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Role-based permission middleware (kept for potential legacy role checks if needed elsewhere, but less critical now)
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRole = req.user.role || 'task_creator';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Permission middleware
export const requirePermission = (section, requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPermissions = req.user.permissions?.[section] || [];
    
    // Admins have all permissions, so they bypass this check
    if (req.user.role === 'admin') {
      return next();
    }

    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (hasPermission) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions for this action.' });
    }
  };
};

