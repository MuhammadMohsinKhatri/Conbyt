import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/database.js';
import { generateToken, JWT_SECRET } from '../../middleware/auth.js';

const router = express.Router();

// Register admin (only for initial setup, should be disabled in production)
// TODO: Disable this in production or add IP whitelist
router.post('/register', async (req, res) => {
  // Security: Disable registration in production
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_REGISTRATION !== 'true') {
    return res.status(403).json({ error: 'Registration is disabled in production' });
  }
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate role if provided
    // Special case: admin@conbyt.com always gets admin role
    let userRole = 'task_creator';
    if (email === 'admin@conbyt.com') {
      userRole = 'admin';
      console.log('🔐 Setting admin role for admin@conbyt.com');
    } else if (role && ['admin', 'task_manager', 'task_creator'].includes(role)) {
      userRole = role;
    }

    // Check if user exists (support both table names)
    const tableName = process.env.ADMIN_TABLE || 'admin_users';
    const [existing] = await pool.execute(
      `SELECT * FROM ${tableName} WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (support both table/column structures)
    const passwordColumn = tableName === 'admins' ? 'hashed_password' : 'password_hash';
    
    // Check if role column exists
    try {
      await pool.execute(
        `INSERT INTO ${tableName} (username, email, ${passwordColumn}, role) VALUES (?, ?, ?, ?)`,
        [username, email, passwordHash, userRole]
      );
    } catch (err) {
      // If role column doesn't exist, insert without it
      if (err.message.includes('Unknown column') || err.code === 'ER_BAD_FIELD_ERROR') {
        await pool.execute(
          `INSERT INTO ${tableName} (username, email, ${passwordColumn}) VALUES (?, ?, ?)`,
          [username, email, passwordHash]
        );
      } else {
        throw err;
      }
    }

    res.status(201).json({ success: true, message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Try both table names
    const tablesToTry = process.env.ADMIN_TABLE ? [process.env.ADMIN_TABLE] : ['admins', 'admin_users'];
    let user = null;
    let passwordHash = null;

    for (const tableName of tablesToTry) {
      try {
        const [users] = await pool.execute(
          `SELECT * FROM ${tableName} WHERE username = ? OR email = ?`,
          [username, username]
        );

        if (users.length > 0) {
          user = users[0];
          // Get password field (support both column names)
          passwordHash = user.password_hash || user.hashed_password;
          if (passwordHash) {
            console.log(`✅ Found user in table: ${tableName}`);
            break;
          }
        }
      } catch (err) {
        // Table doesn't exist, try next one
        console.log(`Table ${tableName} not found, trying next...`);
        continue;
      }
    }

    if (!user || !passwordHash) {
      console.error('❌ User not found or password field missing');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password is already hashed (starts with $2a$ or $2b$)
    let isValid = false;
    
    if (passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$') || passwordHash.startsWith('$2y$')) {
      // Password is hashed, use bcrypt compare
      isValid = await bcrypt.compare(password, passwordHash);
      console.log('🔐 Using bcrypt comparison');
    } else {
      // Password is plain text (for migration purposes)
      isValid = password === passwordHash;
      console.log('⚠️ Password stored as plain text - please hash it!');
      if (isValid) {
        // Auto-hash the password for future use
        const newHash = await bcrypt.hash(password, 10);
        const tableName = user.password_hash ? 'admin_users' : 'admins';
        const passwordColumn = user.password_hash ? 'password_hash' : 'hashed_password';
        await pool.execute(
          `UPDATE ${tableName} SET ${passwordColumn} = ? WHERE id = ?`,
          [newHash, user.id]
        );
        console.log('✅ Password has been automatically hashed and updated');
      }
    }

    if (!isValid) {
      console.error('❌ Password comparison failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ensure admin@conbyt.com has admin role
    if (user.email === 'admin@conbyt.com' && user.role !== 'admin') {
      const tableName = user.password_hash ? 'admin_users' : 'admins';
      try {
        await pool.execute(
          `UPDATE ${tableName} SET role = 'admin' WHERE id = ?`,
          [user.id]
        );
        user.role = 'admin';
        console.log('✅ Updated admin@conbyt.com role to admin');
      } catch (err) {
        console.error('⚠️  Could not update role:', err.message);
      }
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || (user.email === 'admin@conbyt.com' ? 'admin' : 'task_creator')
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database (support both table names)
    const tableName = process.env.ADMIN_TABLE || 'admin_users';
    const [users] = await pool.execute(
      `SELECT id, username, email FROM ${tableName} WHERE id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email,
        role: users[0].role || 'task_creator'
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;

