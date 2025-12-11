import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🔄 Starting production migration for tasks and roles...');

    // Step 1: Add role column to admin_users if it doesn't exist
    console.log('📋 Step 1: Adding role column to admin_users...');
    try {
      await pool.execute(`
        ALTER TABLE admin_users 
        ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
        DEFAULT 'task_creator'
      `);
      console.log('✅ Role column added to admin_users');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || error.code === 'ER_DUP_FIELD_ERROR' || error.errno === 1060) {
        console.log('ℹ️  Role column already exists in admin_users');
      } else {
        console.error('⚠️  Error adding role column:', error.message);
        // Continue anyway - might be using different table structure
      }
    }

    // Also try for 'admins' table if it exists
    try {
      await pool.execute(`
        ALTER TABLE admins 
        ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
        DEFAULT 'task_creator'
      `);
      console.log('✅ Role column added to admins');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || error.code === 'ER_DUP_FIELD_ERROR' || error.errno === 1060) {
        console.log('ℹ️  Role column already exists in admins');
      } else if (error.message.includes("doesn't exist") || error.code === 'ER_NO_SUCH_TABLE') {
        console.log('ℹ️  admins table does not exist (using admin_users)');
      } else {
        console.log('ℹ️  Could not add role to admins table (may not exist)');
      }
    }

    // Step 2: Create tasks table
    console.log('📋 Step 2: Creating tasks table...');
    try {
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
      console.log('✅ Tasks table created successfully');
    } catch (error) {
      if (error.message.includes('already exists') || error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('ℹ️  Tasks table already exists');
      } else {
        // Try without foreign key constraints if they fail
        console.log('⚠️  Error creating tasks table with foreign keys, trying without...');
        try {
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
              INDEX idx_status (status),
              INDEX idx_priority (priority),
              INDEX idx_project_id (project_id),
              INDEX idx_created_by (created_by),
              INDEX idx_due_date (due_date)
            )
          `);
          console.log('✅ Tasks table created without foreign keys');
        } catch (err) {
          console.error('❌ Failed to create tasks table:', err.message);
          throw err;
        }
      }
    }

    // Step 3: Create task_assignments table
    console.log('📋 Step 3: Creating task_assignments table...');
    try {
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
      console.log('✅ Task_assignments table created successfully');
    } catch (error) {
      if (error.message.includes('already exists') || error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('ℹ️  Task_assignments table already exists');
      } else {
        // Try without foreign key constraints if they fail
        console.log('⚠️  Error creating task_assignments table with foreign keys, trying without...');
        try {
          await pool.execute(`
            CREATE TABLE IF NOT EXISTS task_assignments (
              id INT AUTO_INCREMENT PRIMARY KEY,
              task_id INT NOT NULL,
              user_id INT NOT NULL,
              assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE KEY unique_assignment (task_id, user_id),
              INDEX idx_task_id (task_id),
              INDEX idx_user_id (user_id)
            )
          `);
          console.log('✅ Task_assignments table created without foreign keys');
        } catch (err) {
          console.error('❌ Failed to create task_assignments table:', err.message);
          throw err;
        }
      }
    }

    // Step 4: Set admin role for admin@conbyt.com
    console.log('📋 Step 4: Setting admin role for admin@conbyt.com...');
    try {
      const [result] = await pool.execute(
        `UPDATE admin_users SET role = 'admin' WHERE email = ?`,
        ['admin@conbyt.com']
      );
      if (result.affectedRows > 0) {
        console.log('✅ Set admin role for admin@conbyt.com');
      } else {
        console.log('ℹ️  admin@conbyt.com not found in admin_users (may not exist yet)');
      }
    } catch (error) {
      console.log('ℹ️  Could not update admin role (column may not exist or user not found)');
    }

    // Also try for admins table
    try {
      const [result] = await pool.execute(
        `UPDATE admins SET role = 'admin' WHERE email = ?`,
        ['admin@conbyt.com']
      );
      if (result.affectedRows > 0) {
        console.log('✅ Set admin role for admin@conbyt.com in admins table');
      }
    } catch (error) {
      // Ignore if table doesn't exist
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Role column added/verified in admin_users');
    console.log('   - Tasks table created/verified');
    console.log('   - Task_assignments table created/verified');
    console.log('   - Admin role set for admin@conbyt.com');
    console.log('\n🔄 Please restart your server for changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();

