# Database Setup Guide

## Quick Fix for Connection Errors

If you're seeing "MySQL database connection error", follow these steps:

### Step 1: Create .env File

Create a `.env` file in the `server` directory with your Hostinger database credentials:

```env
# For Hostinger, you need to use the REMOTE MySQL host
# Check your Hostinger hosting panel for the correct host
DB_HOST=mysql.hostinger.com
# OR if you have a specific host, use that
# DB_HOST=your-hostinger-mysql-host.com

DB_USER=u808116186_admin
DB_PASSWORD=your_actual_password_here
DB_NAME=u808116186_conbyt_db
DB_PORT=3306

PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```

### Step 2: Find Your Hostinger MySQL Host

1. Log into your Hostinger hosting panel
2. Go to **Databases** → **MySQL Databases**
3. Look for **Remote MySQL** or **MySQL Host**
4. The host is usually something like:
   - `mysql.hostinger.com`
   - `localhost` (if connecting from same server)
   - A specific IP address

### Step 3: Enable Remote MySQL Access (if needed)

If connecting from your local machine:

1. In Hostinger panel, go to **Databases** → **Remote MySQL**
2. Add your IP address to allowed hosts
3. Or use `%` to allow all IPs (less secure, for development only)

### Step 4: Test Connection

After creating `.env`, restart the server:

```bash
cd server
npm start
```

You should see:
```
✅ MySQL database connected successfully
```

### Common Issues

#### Issue 1: "Access denied for user"
- **Solution**: Check your DB_USER and DB_PASSWORD in `.env`
- Make sure password doesn't have special characters that need escaping

#### Issue 2: "Can't connect to MySQL server"
- **Solution**: 
  - Check DB_HOST is correct (not localhost for remote)
  - Verify Remote MySQL is enabled in Hostinger
  - Check firewall/port 3306 is open

#### Issue 3: "Unknown database"
- **Solution**: 
  - Verify DB_NAME matches exactly (case-sensitive)
  - Database might need to be created first in Hostinger panel

#### Issue 4: Connection timeout
- **Solution**:
  - Hostinger might block external connections
  - Try using `localhost` if running on Hostinger server
  - Or use SSH tunnel for local development

### Alternative: Local Development Database

For local development, you can use a local MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=conbyt_db
DB_PORT=3306
```

Then create the database locally:
```sql
CREATE DATABASE conbyt_db;
```

### Testing the Connection

You can test the connection manually:

```bash
# Using MySQL client
mysql -h mysql.hostinger.com -u u808116186_admin -p u808116186_conbyt_db

# Or test from Node.js
node -e "require('mysql2/promise').createConnection({host:'mysql.hostinger.com',user:'u808116186_admin',password:'yourpass',database:'u808116186_conbyt_db'}).then(()=>console.log('OK')).catch(e=>console.error(e))"
```

### Security Notes

⚠️ **Important**:
- Never commit `.env` file to git
- Use strong passwords
- Change JWT_SECRET to a random 32+ character string
- In production, use environment variables from hosting panel

