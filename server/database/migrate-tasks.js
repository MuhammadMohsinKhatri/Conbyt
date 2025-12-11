import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🔄 Starting tasks and roles migration...');

    // Add role column to admin_users if it doesn't exist
    try {
      await pool.execute(`
        ALTER TABLE admin_users 
        ADD COLUMN IF NOT EXISTS role ENUM('admin', 'task_manager', 'task_creator') 
        DEFAULT 'task_creator'
      `);
      console.log('✅ Added role column to admin_users');
    } catch (error) {
      // Column might already exist, check if it's a different error
      if (!error.message.includes('Duplicate column name')) {
        // Try MySQL syntax (doesn't support IF NOT EXISTS for ALTER TABLE)
        try {
          await pool.execute(`
            ALTER TABLE admin_users 
            ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
            DEFAULT 'task_creator'
          `);
          console.log('✅ Added role column to admin_users');
        } catch (err) {
          if (err.message.includes('Duplicate column name') || err.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️  Role column already exists');
          } else {
            throw err;
          }
        }
      } else {
        console.log('ℹ️  Role column already exists');
      }
    }

    // Set default admin role for existing users (optional - you may want to set this manually)
    // await pool.execute(`UPDATE admin_users SET role = 'admin' WHERE role IS NULL`);

    // Create tasks table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('todo', 'in_progress', 'review', 'done') DEFAULT 'todo',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        project_id INT,
        created_by INT NOT NULL,
        due_date DATE,
        completed_at TIMESTAMP NULL,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_project_id (project_id),
        INDEX idx_created_by (created_by),
        INDEX idx_due_date (due_date)
      )
    `);
    console.log('✅ Created tasks table');

    // Create task_assignments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS task_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        user_id INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_assignment (task_id, user_id),
        INDEX idx_task_id (task_id),
        INDEX idx_user_id (user_id)
      )
    `);
    console.log('✅ Created task_assignments table');

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

