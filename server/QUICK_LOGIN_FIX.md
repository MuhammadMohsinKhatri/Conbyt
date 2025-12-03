# Quick Login Fix Guide

## Step 1: Verify Your User in Database

Run this to check your user:

```bash
cd server
npm run verify-user admin@conbyt.com
```

This will show:
- Which table your user is in
- What password field exists
- Whether password is hashed or plain text

## Step 2: Hash Your Password

If password is plain text, hash it:

```bash
npm run hash-password "conByt_123"
```

Copy the hashed output (starts with `$2a$10$...`)

## Step 3: Update Database

Run this SQL in phpMyAdmin:

```sql
-- If your table is 'admins' and column is 'hashed_password':
UPDATE admins 
SET hashed_password = 'PASTE_HASHED_PASSWORD_HERE' 
WHERE email = 'admin@conbyt.com';

-- OR if your table is 'admin_users' and column is 'password_hash':
UPDATE admin_users 
SET password_hash = 'PASTE_HASHED_PASSWORD_HERE' 
WHERE email = 'admin@conbyt.com';
```

## Step 4: Set Environment Variable (Optional)

If your table is `admins`, add to `server/.env`:

```env
ADMIN_TABLE=admins
```

## Step 5: Restart Backend

```bash
cd server
npm start
```

## Step 6: Test Login

Go to: `http://localhost:3000/cms/login`

- Email: `admin@conbyt.com`
- Password: `conByt_123`

## Troubleshooting

### Still getting "Invalid credentials"?

1. **Check backend logs** - Look for error messages
2. **Verify user exists:**
   ```bash
   npm run verify-user admin@conbyt.com
   ```
3. **Check password hash:**
   - Should start with `$2a$10$` or similar
   - Should be 60 characters long
4. **Test password hash:**
   ```bash
   npm run hash-password "conByt_123"
   # Compare with database value
   ```

### Password Auto-Hashing

The code now automatically detects plain text passwords and hashes them on first successful login. But it's better to hash it manually first.

