# Fix Login Issue

## Problem
Your database has:
- Table name: `admins` (not `admin_users`)
- Column name: `hashed_password` (not `password_hash`)
- Password: `conByt_123` (plain text, needs to be hashed)

## Solution

### Option 1: Hash Your Existing Password (Recommended)

1. **Generate bcrypt hash for your password:**
   ```bash
   cd server
   node scripts/hash-password.js "conByt_123"
   ```

2. **Update your database:**
   ```sql
   UPDATE admins 
   SET hashed_password = 'PASTE_THE_HASHED_PASSWORD_HERE' 
   WHERE email = 'admin@conbyt.com';
   ```

3. **Set environment variable to use your table:**
   In `server/.env`, add:
   ```env
   ADMIN_TABLE=admins
   ```

### Option 2: Create New User via API

1. **Make sure registration is enabled** (temporarily)
2. **Create user via API:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@conbyt.com",
       "password": "conByt_123"
     }'
   ```

### Option 3: Update Database Structure

If you want to use the standard structure:

```sql
-- Rename table
ALTER TABLE admins RENAME TO admin_users;

-- Rename column
ALTER TABLE admin_users CHANGE hashed_password password_hash VARCHAR(255);
```

## Quick Fix Steps

1. **Hash your password:**
   ```bash
   cd server
   node scripts/hash-password.js "conByt_123"
   ```

2. **Copy the hashed password** from the output

3. **Update database in phpMyAdmin:**
   ```sql
   UPDATE admins 
   SET hashed_password = 'YOUR_HASHED_PASSWORD_FROM_STEP_1' 
   WHERE email = 'admin@conbyt.com';
   ```

4. **Add to server/.env:**
   ```env
   ADMIN_TABLE=admins
   ```

5. **Restart backend server:**
   ```bash
   cd server
   npm start
   ```

6. **Try logging in again** at `http://localhost:3000/cms/login`
   - Username/Email: `admin@conbyt.com`
   - Password: `conByt_123`

## Test Login

After fixing, test with:
- Email: `admin@conbyt.com`
- Password: `conByt_123`

The code now supports both table structures automatically!

