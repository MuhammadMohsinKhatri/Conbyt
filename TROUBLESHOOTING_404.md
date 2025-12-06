# Troubleshooting 404 Error on conbyt.com

## Current Issue

- ✅ Domain is working: `https://conbyt.com` is accessible
- ✅ SSL is working: HTTPS connection established
- ✅ Server is responding: Express server is running
- ❌ Getting 404 error on root path `/`

## Root Cause

The 404 error suggests that the React app's `dist` folder is either:
1. Not being built during Docker build
2. Not being copied to the correct location
3. Not being found by the server

## Debugging Steps

### Step 1: Check Railway Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **Logs** tab
4. Look for these messages on startup:

**Expected logs (if working):**
```
✅ Serving static files from: /app/dist
📁 Files in dist: index.html, assets, ...
🚀 Server is running on port 8080
```

**Error logs (if not working):**
```
❌ ERROR: dist folder not found at /app/dist
Current working directory: /app/server
__dirname: /app/server
```

### Step 2: Verify Environment Variables

In Railway dashboard → **Variables** tab, ensure:
```
NODE_ENV=production
```

**If NODE_ENV is not set to 'production':**
- The static file serving code won't run
- The server will only serve API routes
- This would cause 404 on root path

### Step 3: Check Docker Build Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Check the build logs for:
   - `npm run build` command execution
   - Any build errors
   - `dist` folder creation

**Expected build output:**
```
> vite build
vite v7.x.x building for production...
✓ built in X.XXs
dist/index.html
dist/assets/...
```

### Step 4: Test API Endpoints

Test if the API is working:
- https://conbyt.com/api/health
- https://conbyt.com/api

If these work but `/` doesn't, it confirms the issue is with static file serving.

## Solutions

### Solution 1: Verify NODE_ENV is Set

**In Railway Variables:**
1. Go to **Variables** tab
2. Add/verify: `NODE_ENV=production`
3. Redeploy the service

### Solution 2: Check Dockerfile Build

The Dockerfile should:
1. Build the frontend: `RUN npm run build`
2. Copy dist folder: `COPY --from=frontend-builder /app/dist ./dist`

**Verify the Dockerfile:**
```dockerfile
# Frontend build stage
RUN npm run build  # This should create dist/ folder

# Production stage
COPY --from=frontend-builder /app/dist ./dist  # This should copy it
```

### Solution 3: Force Rebuild

1. In Railway dashboard
2. Go to your service
3. Click **Settings** → **General**
4. Click **Redeploy** or trigger a new deployment
5. Watch the build logs to ensure `npm run build` runs successfully

### Solution 4: Check File Permissions

The Dockerfile sets:
```dockerfile
RUN chown -R nodejs:nodejs /app
USER nodejs
```

This should give the nodejs user access to the dist folder. If there are permission issues, you'll see errors in logs.

### Solution 5: Manual Verification

If you have Railway CLI access, you can check:

```bash
railway run ls -la /app/dist
railway run cat /app/dist/index.html
```

## Quick Fix Checklist

- [ ] `NODE_ENV=production` is set in Railway Variables
- [ ] Docker build logs show `npm run build` completed successfully
- [ ] Docker build logs show `dist` folder was created
- [ ] Server logs show "✅ Serving static files from: /app/dist"
- [ ] Server logs show files listed in dist folder
- [ ] No errors about missing dist folder in logs

## Expected Behavior After Fix

Once fixed, you should see:

1. **Server logs:**
   ```
   ✅ Serving static files from: /app/dist
   📁 Files in dist: index.html, assets, ...
   🚀 Server is running on port 8080
   ```

2. **Website:**
   - https://conbyt.com → Shows React app homepage
   - https://conbyt.com/api/health → Returns JSON response
   - All routes work correctly

## Next Steps

1. **Check Railway logs** first (most important)
2. **Verify NODE_ENV=production** is set
3. **Check build logs** to ensure dist folder was created
4. **Redeploy** if needed
5. **Test the website** again

The improved error handling in `server.js` will now provide detailed logs about what's happening with the dist folder.

