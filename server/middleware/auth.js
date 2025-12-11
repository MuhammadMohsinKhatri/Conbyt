import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authenticate admin middleware
export const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
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

// Role-based permission middleware
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

// Permission helpers
export const canManageAllTasks = (user) => {
  return user.role === 'admin' || user.role === 'task_manager';
};

export const canCreateTasks = (user) => {
  return user.role === 'admin' || user.role === 'task_manager' || user.role === 'task_creator';
};

export const canUpdateOwnTasks = (user) => {
  return user.role === 'admin' || user.role === 'task_manager' || user.role === 'task_creator';
};

