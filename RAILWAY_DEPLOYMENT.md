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
     PORT=5000
     DB_HOST=<your_db_host>
     DB_USER=<your_db_user>
     DB_PASSWORD=<your_db_password>
     DB_NAME=<your_db_name>
     DB_PORT=3306
     JWT_SECRET=<generate_a_strong_random_string>
     FRONTEND_URL=<your_railway_domain>
     ```

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
| `PORT` | Server port (Railway sets this automatically) | `5000` |
| `DB_HOST` | MySQL host | `containers-us-west-xxx.railway.app` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `railway` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | Secret for JWT tokens | `your_random_secret` |
| `FRONTEND_URL` | Your Railway domain | `https://your-app.railway.app` |

## Database Setup

1. **If using Railway MySQL**:
   - Railway automatically provides connection variables
   - Look for `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` in Railway
   - Map them to your app's expected variables

2. **Run database migrations**:
   - You may need to run your database schema manually
   - Use Railway's CLI or connect via MySQL client:
     ```bash
     railway run node server/scripts/test-connection.js
     ```

## Custom Domain

1. In Railway project, go to "Settings" → "Domains"
2. Add your custom domain
3. Update `FRONTEND_URL` environment variable
4. Update CORS origins in `server/server.js` if needed

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

## Next Steps

1. Deploy to Railway
2. Test all API endpoints
3. Test frontend routes
4. Set up custom domain
5. Configure SSL (automatic with Railway)
6. Set up monitoring and alerts

