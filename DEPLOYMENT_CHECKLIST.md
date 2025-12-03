# Pre-Deployment Checklist

## ✅ Code Ready
- [x] Frontend React app complete
- [x] Backend Node.js API complete
- [x] Database schema ready
- [x] CMS dashboard functional
- [x] SEO plugin integrated
- [x] Contact form working

## ⚠️ Before Deploying - DO THESE:

### 1. Environment Variables
- [ ] Create `.env.production` for frontend
- [ ] Create `server/.env` on Hostinger server
- [ ] Set `VITE_API_URL` to production URL
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Verify database credentials

### 2. Security
- [ ] Disable admin registration endpoint in production
- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS for production domain only
- [ ] Remove console.logs from production code

### 3. Database
- [ ] Run `schema.sql` in Hostinger MySQL
- [ ] Create admin user
- [ ] Test database connection
- [ ] Backup existing data (if any)

### 4. Build
- [ ] Run `npm run build` for frontend
- [ ] Test production build locally: `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Check for broken links

### 5. Server Setup
- [ ] Install Node.js on Hostinger (if needed)
- [ ] Install PM2: `npm install -g pm2`
- [ ] Set up PM2 ecosystem config
- [ ] Configure reverse proxy (if needed)
- [ ] Set up auto-restart on server reboot

### 6. Files to Upload
- [ ] Upload `dist/` folder contents to `public_html/`
- [ ] Upload `server/` folder to backend directory
- [ ] Upload `.htaccess` to `public_html/`
- [ ] Set correct file permissions

### 7. Testing
- [ ] Test API: `https://conbyt.com/api/health`
- [ ] Test frontend: `https://conbyt.com`
- [ ] Test CMS login
- [ ] Test blog creation
- [ ] Test contact form
- [ ] Test SEO plugin
- [ ] Test on mobile devices

### 8. Post-Deployment
- [ ] Set up monitoring/logging
- [ ] Configure backups
- [ ] Set up error tracking
- [ ] Test email notifications (if any)
- [ ] Verify SSL certificate
- [ ] Check page load speed
- [ ] Test all forms

## 🚨 Critical Security Items

1. **Never commit `.env` files** ✅ (Already in .gitignore)
2. **Use strong JWT_SECRET** - Generate random 32+ character string
3. **Disable registration** - Remove or protect `/api/admin/auth/register`
4. **HTTPS only** - Force all traffic to HTTPS
5. **CORS restrictions** - Only allow your domain
6. **Rate limiting** - Consider adding for API endpoints

## 📝 Quick Deploy Commands

```bash
# 1. Build frontend
npm run build

# 2. Test build locally
npm run preview

# 3. On server - Install dependencies
cd server
npm install --production

# 4. On server - Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 🔍 Verification Steps

After deployment, verify:

1. **API Health Check:**
   ```bash
   curl https://conbyt.com/api/health
   ```

2. **Database Connection:**
   ```bash
   cd server
   npm run test-db
   ```

3. **Frontend Loads:**
   - Visit https://conbyt.com
   - Check browser console for errors
   - Verify all images/assets load

4. **CMS Access:**
   - Visit https://conbyt.com/cms/login
   - Login with admin credentials
   - Create a test blog post

## ⚡ Performance Optimization

- [ ] Enable Gzip compression (in .htaccess)
- [ ] Set up browser caching
- [ ] Optimize images (WebP format)
- [ ] Minify CSS/JS (Vite does this automatically)
- [ ] Enable CDN (optional)

## 📊 Monitoring

Consider setting up:
- [ ] Uptime monitoring
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (Google Analytics)
- [ ] Server monitoring (PM2 monitoring)

## 🆘 Rollback Plan

If something goes wrong:
1. Keep backup of previous version
2. Document rollback steps
3. Test rollback procedure
4. Have database backup ready

