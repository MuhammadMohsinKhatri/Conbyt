# Setting Admin Role for admin@conbyt.com

## Quick Setup

The user `admin@conbyt.com` should have full admin permissions. Here are the ways to ensure this:

## Method 1: Run the Script (Recommended)

```bash
cd server
node database/set-admin-role.js
```

This script will:
- Ensure the `role` column exists in `admin_users` table
- Set `admin@conbyt.com` to have `admin` role
- Display the user's current role for verification

## Method 2: Direct SQL Update

If you have database access (phpMyAdmin, MySQL client, etc.):

```sql
-- First, ensure role column exists
ALTER TABLE admin_users 
ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
DEFAULT 'task_creator';

-- Set admin role for admin@conbyt.com
UPDATE admin_users 
SET role = 'admin' 
WHERE email = 'admin@conbyt.com';
```

## Method 3: Automatic on Registration

If registering a new user with email `admin@conbyt.com`, the system will automatically assign the `admin` role.

## Method 4: Automatic on Login

The system automatically ensures `admin@conbyt.com` has admin role when logging in. If the role is missing, it will be updated automatically.

## Verify Admin Role

After setting the role, verify it by:

1. **Log out and log back in** to refresh the JWT token
2. Check the dashboard - you should see the "Users" menu item (admin only)
3. Go to `/cms/users` - you should be able to access user management
4. Check browser console - user object should show `role: "admin"`

## Admin Permissions

With `admin` role, `admin@conbyt.com` can:

- ✅ **Full access** to all CMS features
- ✅ **Manage all tasks** (create, update, delete any task)
- ✅ **Assign tasks** to any user
- ✅ **Manage user roles** (access `/cms/users`)
- ✅ **View all tasks** (not limited to own/assigned)
- ✅ **Export all data**
- ✅ **Access all filters** and search

## Troubleshooting

### Role Not Updating

1. **Check database connection** - Ensure the script can connect
2. **Verify email** - Make sure the email is exactly `admin@conbyt.com`
3. **Check column exists** - Run the migration script first
4. **Log out and back in** - JWT token needs to be refreshed

### Still Seeing Limited Access

1. **Clear browser cache** and localStorage
2. **Log out completely** from `/cms/login`
3. **Log back in** with `admin@conbyt.com`
4. **Check browser console** - Look for user object with role

### User Not Found

If the script says "No user found":
1. Check if the user exists: `SELECT * FROM admin_users WHERE email = 'admin@conbyt.com'`
2. The email might be different - check all users: `SELECT email, username FROM admin_users`
3. Create the user first via registration or direct SQL insert

## Security Note

The system automatically ensures `admin@conbyt.com` has admin role on:
- Registration (if email matches)
- Login (auto-updates if missing)

This provides a fallback to ensure the main admin account always has proper permissions.

