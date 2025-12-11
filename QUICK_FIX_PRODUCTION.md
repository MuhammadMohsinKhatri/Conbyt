# Quick Fix for Production Errors

## The Problem

Your production server is showing these errors:
- ❌ `Table 'tasks' doesn't exist`
- ❌ `Unknown column 'role' in 'SELECT'`

## The Solution

Run the migration script to create the missing tables and columns.

### On Railway (Recommended)

1. **Open Railway Dashboard**
2. **Go to your service**
3. **Open the "Deployments" tab**
4. **Click "Run Command"** or use the CLI:

```bash
railway run node server/database/migrate-production.js
```

### Or via SSH/Direct Access

```bash
cd server
node database/migrate-production.js
```

### Or using npm script

```bash
cd server
npm run migrate-tasks
```

## What the Script Does

✅ Adds `role` column to `admin_users` table  
✅ Creates `tasks` table  
✅ Creates `task_assignments` table  
✅ Sets admin role for `admin@conbyt.com`  
✅ Handles errors gracefully (won't fail if already exists)

## After Running

1. **Restart your server** (Railway will auto-restart)
2. **Test the tasks page** - Should work now!
3. **Log in** with `admin@conbyt.com` - Should have admin permissions

## Alternative: Direct SQL

If you have database access (phpMyAdmin, MySQL client):

```sql
-- Add role column
ALTER TABLE admin_users 
ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
DEFAULT 'task_creator';

-- Create tasks table
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
);

-- Create task_assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_assignment (task_id, user_id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id)
);

-- Set admin role
UPDATE admin_users SET role = 'admin' WHERE email = 'admin@conbyt.com';
```

## Verification

After migration, check:

```sql
-- Verify tables exist
SHOW TABLES LIKE 'tasks';
SHOW TABLES LIKE 'task_assignments';

-- Verify role column
DESCRIBE admin_users;

-- Verify admin role
SELECT email, role FROM admin_users WHERE email = 'admin@conbyt.com';
```

## That's It!

Once the migration runs, your tasks page should work perfectly! 🎉

