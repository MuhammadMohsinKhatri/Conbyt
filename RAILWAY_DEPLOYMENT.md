# Railway Deployment Guide

This guide will help you deploy your Conbyt application to Railway.

## What Was Fixed

1. **Case-sensitive import issue**: Fixed `C5.png` → `c5.png` in `TrustedBySection.jsx`
2. **Server static file serving**: Updated server to serve the built React app in production
3. **Dockerfile**: Created multi-stage Dockerfile for optimized production builds
4. **Railway configuration**: Added `railway.json` for Railway-specific settings

## Prerequisites

- Railway account (sign up at https://railway.app)
- MySQL database (Railway provides MySQL addon, or use external database)
- Environment variables configured

## Deployment Steps

### Option 1: Using Dockerfile (Recommended)

Railway will automatically detect the Dockerfile and use it for deployment.

1. **Connect your repository to Railway**:
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or Git provider)
   - Select your repository

2. **Add MySQL Database** (if needed):
   - In your Railway project, click "New"
   - Select "Database" → "MySQL"
   - Railway will provide connection details

3. **Configure Environment Variables**:
   - In your Railway project, go to "Variables"
   - Add the following variables:
     ```
     NODE_ENV=production
     PORT=8080
     JWT_SECRET=<generate_a_strong_random_string>
     FRONTEND_URL=https://conbyt.com
     ```
   
   **For Database Variables, choose one:**
   
   **Option A: Using Railway MySQL** (if you added MySQL service):
     ```
     DB_HOST=${{MYSQL_HOST}}
     DB_USER=${{MYSQL_USER}}
     DB_PASSWORD=${{MYSQL_PASSWORD}}
     DB_NAME=${{MYSQL_DATABASE}}
     DB_PORT=${{MYSQL_PORT}}
     ```
   
   **Option B: Using Hostinger MySQL** (keep existing database):
     ```
     DB_HOST=auth-db1800.hstgr.io
     DB_USER=u808116186_admin
     DB_PASSWORD=your_actual_hostinger_password
     DB_NAME=u808116186_conbyt_db
     DB_PORT=3306
     ```
   
   - **Note:** Railway will automatically set `PORT=8080`, but you can explicitly set it if needed

4. **Deploy**:
   - Railway will automatically build and deploy when you push to your main branch
   - Or click "Deploy" in the Railway dashboard

### Option 2: Using Railpack (Alternative)

If you prefer to use Railpack instead of Docker:

1. Railway will auto-detect your Node.js project
2. Make sure your `package.json` has the build script: `"build": "vite build"`
3. Railway will run `npm ci` and `npm run build` automatically
4. You may need to configure the start command manually

## Environment Variables

Required environment variables in Railway:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets this automatically to 8080) | `8080` |
| `DB_HOST` | MySQL host | `containers-us-west-xxx.railway.app` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `railway` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | Secret for JWT tokens | `your_random_secret` |
| `FRONTEND_URL` | Your custom domain or Railway domain | `https://conbyt.com` |

**Note:** Railway automatically sets the `PORT` environment variable to `8080` (as configured in your Dockerfile). Your server code uses `process.env.PORT || 5000`, so it will correctly use Railway's port.

## Database Setup

You have **two options** for MySQL database with Railway:

### Option 1: Use Railway MySQL (Recommended for New Deployments)

Railway offers a managed MySQL database addon that's easy to set up and automatically scales.

#### Step 1: Add MySQL Database in Railway

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically provision a MySQL database
4. Railway will create environment variables automatically

#### Step 2: Configure Environment Variables

Railway automatically creates these variables (you'll see them in the Variables tab):
- `MYSQL_HOST` (e.g., `containers-us-west-xxx.railway.app`)
- `MYSQL_USER` (usually `root`)
- `MYSQL_PASSWORD` (auto-generated)
- `MYSQL_DATABASE` (usually `railway`)
- `MYSQL_PORT` (usually `3306`)

**Map Railway variables to your app's expected variables:**

In Railway's **Variables** tab, add these mappings:

```
DB_HOST=${{MYSQL_HOST}}
DB_USER=${{MYSQL_USER}}
DB_PASSWORD=${{MYSQL_PASSWORD}}
DB_NAME=${{MYSQL_DATABASE}}
DB_PORT=${{MYSQL_PORT}}
```

Or manually set them (copy values from Railway's MySQL service):
```
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your_railway_mysql_password
DB_NAME=railway
DB_PORT=3306
```

#### Step 3: Import Database Schema

1. **Connect to Railway MySQL** using Railway CLI or MySQL client:
   ```bash
   # Using Railway CLI
   railway connect mysql
   ```

2. **Or get connection string from Railway:**
   - Go to your MySQL service in Railway
   - Click "Connect" tab
   - Copy the connection string or use the provided credentials

3. **Import your schema:**
   ```bash
   # Using MySQL client
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < server/database/schema.sql
   
   # Or using Railway CLI
   railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < server/database/schema.sql
   ```

4. **Or use Railway's MySQL interface:**
   - Railway provides a web-based MySQL interface
   - Go to your MySQL service → "Data" tab
   - Copy and paste the SQL from `server/database/schema.sql`

#### Step 4: Migrate Data (if needed)

If you have existing data in Hostinger MySQL, you'll need to export and import it:

```bash
# Export from Hostinger
mysqldump -h auth-db1800.hstgr.io -u u808116186_admin -p u808116186_conbyt_db > backup.sql

# Import to Railway
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backup.sql
```

#### Pros of Railway MySQL:
- ✅ Automatic backups
- ✅ Easy scaling
- ✅ Integrated with Railway (same network, faster)
- ✅ No external connection issues
- ✅ Automatic SSL/TLS
- ✅ Managed service (no maintenance)

#### Cons of Railway MySQL:
- ❌ Additional cost (Railway MySQL pricing)
- ❌ Need to migrate existing data
- ❌ New database (starts empty)

---

### Option 2: Continue Using Hostinger MySQL (Keep Existing Database)

If you want to keep using your existing Hostinger MySQL database (`auth-db1800.hstgr.io`), you can connect Railway to it.

#### Step 1: Enable Remote MySQL in Hostinger

1. Log into **Hostinger hPanel**
2. Go to **Databases** → **Remote MySQL**
3. Add Railway's IP addresses (or use `%` to allow all IPs - less secure)
4. **Note:** Railway uses dynamic IPs, so you may need to allow all IPs or contact Hostinger support

#### Step 2: Configure Environment Variables in Railway

In Railway's **Variables** tab, add:

```
DB_HOST=auth-db1800.hstgr.io
DB_USER=u808116186_admin
DB_PASSWORD=your_hostinger_db_password
DB_NAME=u808116186_conbyt_db
DB_PORT=3306
```

**Important:** Make sure to use the actual password, not a placeholder.

#### Step 3: Test Connection

Railway will automatically test the connection when you deploy. You can also test manually:

     ```bash
     railway run node server/scripts/test-connection.js
     ```

#### Pros of Hostinger MySQL:
- ✅ Keep existing data (no migration needed)
- ✅ Already set up and working
- ✅ No additional Railway costs
- ✅ Familiar setup

#### Cons of Hostinger MySQL:
- ❌ External connection (potential latency)
- ❌ Need to configure Remote MySQL access
- ❌ Hostinger may block Railway IPs
- ❌ Less integrated with Railway
- ❌ Manual backup management

---

### Recommendation

**For new deployments:** Use **Railway MySQL** (Option 1) for better integration and performance.

**If you have important existing data:** Start with **Hostinger MySQL** (Option 2), then migrate to Railway MySQL later when convenient.

### Testing Database Connection

After setting up either option, test the connection:

```bash
# Using Railway CLI
railway run node server/scripts/test-connection.js

# Or check Railway logs after deployment
# Look for: "✅ MySQL database connected successfully"
```

### Database Schema

Your database schema is in `server/database/schema.sql`. It includes tables for:
- Case studies
- Blog posts (with SEO fields)
- Admin users
- Testimonials
- Services
- Stats
- Contact submissions

## Custom Domain Configuration

### Step 1: Add Domain in Railway

1. In Railway project, go to **"Settings"** → **"Networking"** → **"Domains"**
2. Click **"Custom Domain"** or **"Add Domain"**
3. Enter your domain: `conbyt.com`
4. Railway will provide you with DNS configuration details

### Step 2: Configure DNS Records

Since your domain `conbyt.com` was previously attached to Hostinger web hosting, you need to update the DNS records to point to Railway instead.

#### Railway DNS Configuration

Railway requires a **CNAME record** to connect your custom domain. Based on your Railway setup:

| Type | Name | Value |
|------|------|-------|
| CNAME | `@` (or root) | `gm9sg2ym.up.railway.app` |

**Note:** The `@` symbol represents the root domain (conbyt.com). Some DNS providers use a blank value or `@` for the root domain.

#### Configuring DNS at Hostinger

1. **Log in to Hostinger**:
   - Go to https://hpanel.hostinger.com
   - Navigate to your domain management

2. **Access DNS Management**:
   - Go to **"Domains"** → Select **"conbyt.com"**
   - Click on **"DNS / Name Servers"** or **"DNS Zone Editor"**

3. **Remove Old Records** (if needed):
   
   **DELETE these records** (they point to old Hostinger hosting):
   - ❌ **A record** for `@` pointing to `46.202.156.147` (old Hostinger IP)
   - ❌ **AAAA record** for `@` pointing to `2a02:4780:3f:1900:0:302a:dfda:5` (old Hostinger IPv6)
   
   **KEEP these records** (needed for email and other services):
   - ✅ **MX records** for `@` (mx1.hostinger.com, mx2.hostinger.com) - for email
   - ✅ **TXT record** for `@` with SPF (`v=spf1 include:_spf.mail.hostinger.com ~all`) - for email
   - ✅ **TXT record** for `_dmarc` - for email security
   - ✅ **CNAME records** for `hostingermail-*._domainkey` - for email DKIM
   - ✅ **CNAME records** for `autodiscover` and `autoconfig` - for email clients
   - ✅ **TXT record** for `@` with Google site verification - for Google Search Console
   - ✅ **CAA records** for `@` - for SSL certificates (Railway uses Let's Encrypt)
   - ✅ **CNAME record** for `www` pointing to `conbyt.com` - will work via the ALIAS record
   - ✅ **A record** for `ftp` - if you still use FTP
   
   **ALREADY CORRECT:**
   - ✅ **ALIAS record** for `@` pointing to `gm9sg2ym.up.railway.app` - this is correct!

4. **Verify Railway ALIAS Record**:
   - ✅ You already have an **ALIAS record** for `@` pointing to `gm9sg2ym.up.railway.app` - this is correct!
   - If the TTL is not `3600`, you can edit it to `3600` for faster propagation
   - **Note:** Hostinger uses ALIAS records instead of CNAME for the root domain, which is perfect for Railway

5. **Save any changes** (if you edited TTL or deleted old records)

#### Alternative: Using A Record (if CNAME not supported for root)

Some DNS providers don't allow CNAME records for the root domain (`@`). If Hostinger doesn't support CNAME for root:

1. **Check Railway for A Record IPs**:
   - Railway may provide A record IP addresses
   - Check Railway's domain settings for alternative configuration

2. **Or use www subdomain**:
   - Add CNAME for `www` → `gm9sg2ym.up.railway.app`
   - Configure Railway to handle both `conbyt.com` and `www.conbyt.com`

### Step 3: Wait for DNS Propagation

- DNS changes can take **up to 72 hours** to propagate worldwide
- Typically takes **15 minutes to 2 hours** in most regions
- You can check propagation status using tools like:
  - https://dnschecker.org
  - https://www.whatsmydns.net

### Step 4: Verify DNS Configuration

1. **Check in Railway Dashboard**:
   - Go to **"Settings"** → **"Networking"** → **"Domains"**
   - Railway will show "Waiting for DNS update" until it detects the CNAME record
   - Once detected, it will show as "Active" or "Verified"

2. **Test Domain**:
   ```bash
   # Check DNS resolution
   nslookup conbyt.com
   # or
   dig conbyt.com
   ```

### Step 5: Update Environment Variables

After DNS is configured and Railway detects it:

1. **Update Railway Environment Variables**:
   - Go to **"Variables"** in Railway project
   - Update `FRONTEND_URL` to: `https://conbyt.com`
   - Add or update CORS origins if needed

2. **Update CORS in Server** (if needed):
   - Update `server/server.js` to allow `https://conbyt.com`:
   ```javascript
   app.use(cors({
     origin: ['https://conbyt.com', 'https://www.conbyt.com'],
     credentials: true
   }));
   ```

### Step 6: SSL Certificate

- Railway automatically provisions SSL certificates via Let's Encrypt
- SSL will be active once DNS is properly configured
- No additional configuration needed

### Important Notes

⚠️ **Before Changing DNS:**
- Make sure your Railway deployment is working on the Railway domain first
- Test that `gm9sg2ym.up.railway.app` is accessible
- Backup any important DNS records (especially MX records for email)

⚠️ **After DNS Change:**
- Your Hostinger hosting will no longer serve the website
- Email will continue to work if you keep MX records unchanged
- If you need email, ensure MX records remain pointing to Hostinger mail servers

### Troubleshooting DNS

**Railway shows "Record not yet detected":**
- Wait 15-30 minutes after adding DNS record
- Verify DNS record is correct using `nslookup` or `dig`
- Check that CNAME value matches exactly: `gm9sg2ym.up.railway.app`

**Domain not resolving:**
- Check DNS propagation status
- Verify DNS record is saved correctly in Hostinger
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**SSL certificate not issued:**
- Wait for DNS to fully propagate
- Ensure domain is verified in Railway
- Check Railway logs for SSL certificate errors

## Troubleshooting

### Build fails with "Could not resolve" errors
- Check file paths are case-sensitive (Linux is case-sensitive)
- All imports should match exact file names

### Database connection errors
- Verify environment variables are set correctly
- Check database is accessible from Railway's network
- Ensure database allows connections from Railway IPs

### Static files not loading
- Ensure `NODE_ENV=production` is set
- Check that `dist` folder is being copied in Dockerfile
- Verify server is serving static files correctly

### CORS errors
- Add your Railway domain to `FRONTEND_URL` environment variable
- Update CORS origins in `server/server.js` if needed

## Monitoring

- Check Railway logs in the dashboard
- Use Railway's metrics to monitor performance
- Set up alerts for deployment failures

## Quick DNS Setup Reference

**For conbyt.com pointing to Railway:**

1. **In Hostinger DNS Zone Editor:**
   - Type: `CNAME`
   - Name: `@` (or leave blank)
   - Value: `gm9sg2ym.up.railway.app`
   - TTL: `3600` (1 hour - recommended) or `14400` (4 hours - default). The TTL field is editable.

2. **Wait 15-30 minutes** for DNS propagation

3. **Verify in Railway:** Settings → Networking → Domains should show "Active"

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Configure DNS records (see Custom Domain section above)
3. Test all API endpoints
4. Test frontend routes
5. Verify SSL certificate is active
6. Set up monitoring and alerts

