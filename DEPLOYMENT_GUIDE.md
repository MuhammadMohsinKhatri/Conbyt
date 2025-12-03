# Hostinger Deployment Guide

## Prerequisites

✅ **What you need:**
- Hostinger hosting account (VPS or Business plan for Node.js)
- MySQL database already set up (you have this)
- Domain name (conbyt.com)
- SSH access (for Node.js deployment)

## Deployment Checklist

### ✅ Frontend (React/Vite)
- [x] Build configuration ready
- [x] Environment variables configured
- [x] Production optimizations

### ✅ Backend (Node.js)
- [x] Express server configured
- [x] Database connection ready
- [x] API routes set up
- [x] Authentication implemented

### ⚠️ Before Deployment

1. **Environment Variables** - Set these in Hostinger
2. **Database Connection** - Verify credentials
3. **Build Frontend** - Generate production build
4. **Node.js Setup** - Ensure Node.js is available
5. **PM2/Process Manager** - Keep server running

## Step-by-Step Deployment

### Option 1: Static Frontend + Node.js Backend (Recommended)

#### Step 1: Build Frontend

```bash
# In project root
npm run build
```

This creates a `dist/` folder with optimized production files.

#### Step 2: Upload Frontend Files

Upload the `dist/` folder contents to:
- `public_html/` (or your domain root)

#### Step 3: Set Up Backend

**If Hostinger supports Node.js:**

1. **Upload server files:**
   ```bash
   # Upload entire server/ directory to:
   /home/u808116186/domains/conbyt.com/backend
   # OR
   /home/u808116186/domains/conbyt.com/nodejs
   ```

2. **Create .env file on server:**
   ```env
   DB_HOST=auth-db1800.hstgr.io
   DB_USER=u808116186_admin
   DB_PASSWORD=your_actual_password
   DB_NAME=u808116186_conbyt_db
   DB_PORT=3306
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-strong-secret-key-min-32-characters
   ```

3. **Install dependencies:**
   ```bash
   cd /path/to/server
   npm install --production
   ```

4. **Start server with PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name conbyt-api
   pm2 save
   pm2 startup
   ```

#### Step 4: Configure Reverse Proxy (if needed)

If Node.js runs on port 5000, set up reverse proxy in `.htaccess`:

```apache
# .htaccess in public_html
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
```

### Option 2: Full Static Deployment (If Node.js not available)

If Hostinger doesn't support Node.js, you'll need to:

1. **Deploy frontend only** to Hostinger
2. **Deploy backend separately** to:
   - Railway.app
   - Render.com
   - Heroku
   - DigitalOcean
   - AWS/Google Cloud

3. **Update frontend API URL:**
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

## Environment Variables Setup

### Frontend (.env.production)

Create `.env.production` in project root:

```env
VITE_API_URL=https://conbyt.com/api
# OR if backend is separate:
VITE_API_URL=https://api.conbyt.com
```

### Backend (.env on server)

Create `.env` in `server/` directory on Hostinger:

```env
DB_HOST=auth-db1800.hstgr.io
DB_USER=u808116186_admin
DB_PASSWORD=your_actual_password_here
DB_NAME=u808116186_conbyt_db
DB_PORT=3306
PORT=5000
NODE_ENV=production
JWT_SECRET=generate-a-strong-random-32-character-string-here
```

## Database Setup

1. **Run schema SQL:**
   - Go to phpMyAdmin in Hostinger
   - Select `u808116186_conbyt_db`
   - Import `server/database/schema.sql`

2. **Create admin user:**
   ```bash
   # Via API (first time only)
   curl -X POST https://conbyt.com/api/admin/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@conbyt.com",
       "password": "your-secure-password"
     }'
   ```

## Production Optimizations

### 1. Enable HTTPS
- Use Hostinger SSL certificate
- Force HTTPS redirects

### 2. Set Up CORS
Update `server/server.js` for production:

```javascript
app.use(cors({
  origin: ['https://conbyt.com', 'https://www.conbyt.com'],
  credentials: true
}));
```

### 3. Error Handling
- Remove console.logs in production
- Set up error logging
- Use environment-based logging

### 4. Security
- Change JWT_SECRET to strong random string
- Disable admin registration in production
- Use HTTPS only
- Set secure cookie flags

## Build Commands

### Frontend Build
```bash
npm run build
# Output: dist/ folder
```

### Backend (No build needed)
```bash
# Just ensure dependencies are installed
cd server
npm install --production
```

## Deployment Scripts

### Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash
echo "Building frontend..."
npm run build

echo "Uploading files..."
# Add your upload commands here
# scp -r dist/* user@hostinger:/public_html/
# scp -r server/* user@hostinger:/backend/

echo "Deployment complete!"
```

## Post-Deployment Checklist

- [ ] Test API endpoints: `https://conbyt.com/api/health`
- [ ] Test frontend: `https://conbyt.com`
- [ ] Test CMS login: `https://conbyt.com/cms/login`
- [ ] Test contact form submission
- [ ] Verify database connections
- [ ] Check SSL certificate
- [ ] Test blog post creation
- [ ] Verify SEO plugin works
- [ ] Check mobile responsiveness

## Troubleshooting

### Backend not accessible
- Check if Node.js is running: `pm2 list`
- Check port: `netstat -tulpn | grep 5000`
- Check firewall settings
- Verify reverse proxy configuration

### Database connection fails
- Verify `.env` file exists and has correct credentials
- Check if Remote MySQL is enabled
- Verify database host is correct
- Test connection: `npm run test-db`

### Frontend API calls fail
- Check CORS settings
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Verify backend is running

## Alternative: Deploy Backend to Cloud

If Hostinger doesn't support Node.js:

### Railway.app (Recommended)
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically
4. Get public URL

### Render.com
1. Create new Web Service
2. Connect repo
3. Set build command: `cd server && npm install`
4. Set start command: `node server.js`
5. Add environment variables

## Support

For Hostinger-specific issues:
- Check Hostinger documentation
- Contact Hostinger support
- Verify your hosting plan supports Node.js

## Notes

⚠️ **Important:**
- Never commit `.env` files
- Use strong JWT_SECRET in production
- Enable HTTPS
- Set up regular backups
- Monitor server logs

