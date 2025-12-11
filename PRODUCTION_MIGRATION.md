# Production Migration Guide

## Issue

Your production server is showing these errors:
1. **Table 'tasks' doesn't exist** - The tasks table needs to be created
2. **Unknown column 'role' in 'SELECT'** - The role column needs to be added to admin_users

## Quick Fix

### Option 1: Run Migration Script (Recommended)

**On Railway/Production Server:**

1. **SSH into your server** or use Railway's CLI:
   ```bash
   railway run node server/database/migrate-production.js
   ```

2. **Or if you have direct server access:**
   ```bash
   cd server
   node database/migrate-production.js
   ```

This script will:
- ✅ Add `role` column to `admin_users` table
- ✅ Create `tasks` table
- ✅ Create `task_assignments` table
- ✅ Set admin role for `admin@conbyt.com`
- ✅ Handle errors gracefully (won't fail if tables/columns already exist)

### Option 2: Direct SQL (via phpMyAdmin or MySQL client)

Run these SQL commands in your database:

```sql
-- 1. Add role column to admin_users
ALTER TABLE admin_users 
ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
DEFAULT 'task_creator';

-- 2. Create tasks table
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

-- 3. Create task_assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_assignment (task_id, user_id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id)
);

-- 4. Set admin role for admin@conbyt.com
UPDATE admin_users 
SET role = 'admin' 
WHERE email = 'admin@conbyt.com';
```

### Option 3: Railway One-Click Deploy

If you're using Railway, you can add this as a one-time script:

1. Go to Railway dashboard
2. Add a new service or use existing
3. Run the migration script as a one-time command

## Verification

After running the migration, verify:

1. **Check tables exist:**
   ```sql
   SHOW TABLES LIKE 'tasks';
   SHOW TABLES LIKE 'task_assignments';
   ```

2. **Check role column exists:**
   ```sql
   DESCRIBE admin_users;
   -- Should show 'role' column
   ```

3. **Check admin role:**
   ```sql
   SELECT id, username, email, role FROM admin_users WHERE email = 'admin@conbyt.com';
   -- Should show role = 'admin'
   ```

4. **Restart your server** to clear any cached errors

5. **Test the tasks page** - Should load without errors

## Troubleshooting

### Migration Script Fails

If the script fails:
1. Check database connection in `.env`
2. Verify database credentials
3. Check if you have CREATE TABLE permissions
4. Try running SQL commands directly

### Foreign Key Errors

If you get foreign key constraint errors:
- The migration script will automatically retry without foreign keys
- This is safe - the relationships will still work
- You can add foreign keys later if needed

### Still Getting Errors

1. **Clear server cache** - Restart the server
2. **Check logs** - Look for specific error messages
3. **Verify tables** - Run `SHOW TABLES;` to see what exists
4. **Check column** - Run `DESCRIBE admin_users;` to see columns

## After Migration

Once migration is complete:

1. ✅ Tasks page should load without errors
2. ✅ You can create, edit, and delete tasks
3. ✅ User management should work
4. ✅ Admin role should be set for admin@conbyt.com

## Next Steps

1. Run the migration script
2. Restart your server
3. Log in with admin@conbyt.com
4. Test the tasks page at `/cms/tasks`
5. Verify you can see the "Users" menu (admin only)

