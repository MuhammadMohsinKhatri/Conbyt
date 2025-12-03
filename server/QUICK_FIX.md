# Quick Fix: Database Connection

## The Problem
You're using `https://auth-db1800.hstgr.io` as the host, but MySQL connections don't use HTTP/HTTPS protocols.

## The Solution
Remove `https://` from the host. Use only the hostname:

### ❌ Wrong:
```env
DB_HOST=https://auth-db1800.hstgr.io
```

### ✅ Correct:
```env
DB_HOST=auth-db1800.hstgr.io
```

## Your .env File Should Look Like:

```env
# Database Configuration
DB_HOST=auth-db1800.hstgr.io
DB_USER=u808116186_admin
DB_PASSWORD=your_actual_password_here
DB_NAME=u808116186_conbyt_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

## Steps to Fix:

1. **Edit your `.env` file** in the `server/` directory
2. **Change** `DB_HOST=https://auth-db1800.hstgr.io` 
3. **To** `DB_HOST=auth-db1800.hstgr.io` (remove https://)
4. **Save** the file
5. **Test** the connection:
   ```bash
   cd server
   npm run test-db
   ```

## Important Notes:

- **phpMyAdmin URL**: `https://auth-db1800.hstgr.io` (for web interface)
- **MySQL Host**: `auth-db1800.hstgr.io` (for database connection)
- **No protocol** (http/https) in MySQL host
- **No port** in the host (port is separate: 3306)

## If Still Not Working:

1. **Enable Remote MySQL** in Hostinger panel:
   - Go to Databases → Remote MySQL
   - Add your IP address (or `%` for all IPs - development only)

2. **Check Firewall**: Make sure port 3306 is not blocked

3. **Verify Credentials**: Double-check username and password in Hostinger panel

