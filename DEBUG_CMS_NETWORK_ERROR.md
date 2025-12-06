# Debugging CMS Network Error

## Current Issue

Still getting "Network error. Please check if the server is running." on the CMS login page.

## Possible Causes

### 1. Changes Not Deployed Yet ⚠️

The changes you just accepted need to be:
- Committed to Git
- Pushed to your repository
- Deployed by Railway

**Check:**
- Have you committed and pushed the changes?
- Is Railway showing a new deployment in progress?

### 2. API URL Detection Issue

The API utility should automatically use `/api` in production. Let's verify:

**Check in browser console:**
1. Open https://conbyt.com/cms/login
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Type: `import.meta.env.PROD`
5. Should return `true` in production

### 3. Server Not Running

**Test API endpoint:**
- Open: https://conbyt.com/api/health
- Should return: `{"status":"OK","message":"Server is running"}`

If this doesn't work, the server isn't running or there's a routing issue.

### 4. CORS Issues

Check browser console for CORS errors. The server should allow:
- `https://conbyt.com`
- `https://www.conbyt.com`

### 5. Database Connection Issues

If the server is running but login fails, check Railway logs for:
- Database connection errors
- MySQL connection timeouts
- Authentication failures

## Quick Debugging Steps

### Step 1: Test API Endpoint

Open in browser:
```
https://conbyt.com/api/health
```

**Expected:** JSON response with `{"status":"OK","message":"Server is running"}`

**If 404:** Server routing issue or not deployed
**If Error:** Server is running but has issues

### Step 2: Check Browser Console

1. Open https://conbyt.com/cms/login
2. Press F12 → Console tab
3. Try to login
4. Look for:
   - Network errors
   - CORS errors
   - Failed fetch requests
   - API URL being used

### Step 3: Check Network Tab

1. Open https://conbyt.com/cms/login
2. Press F12 → Network tab
3. Try to login
4. Look for request to `/api/admin/auth/login`
5. Check:
   - Request URL (should be `https://conbyt.com/api/admin/auth/login`)
   - Status code (200 = success, 404 = not found, 500 = server error)
   - Response body

### Step 4: Check Railway Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **Logs** tab
4. Look for:
   - Server startup messages
   - Database connection status
   - API request logs
   - Error messages

## Expected Behavior

**When working correctly:**
1. Login page loads at https://conbyt.com/cms/login
2. Enter credentials and click "Sign In"
3. Browser makes POST request to `https://conbyt.com/api/admin/auth/login`
4. Server responds with JWT token
5. User is redirected to `/cms/dashboard`

**Current issue:**
- Network error suggests the fetch request is failing
- Could be: wrong URL, CORS, server down, or network issue

## Immediate Fixes to Try

### Fix 1: Verify API URL in Code

The API utility should detect production automatically. But let's add explicit logging:

**Temporary debug in `src/utils/api.js`:**
```javascript
const API_BASE_URL = getApiBaseUrl();
console.log('🔍 API Base URL:', API_BASE_URL);
console.log('🔍 Is Production:', import.meta.env.PROD);
```

### Fix 2: Check Railway Environment

Make sure Railway has:
```
NODE_ENV=production
```

### Fix 3: Force API URL

If automatic detection isn't working, you can set it explicitly in Railway Variables:
```
VITE_API_URL=/api
```

But this shouldn't be necessary since we're using relative paths.

## Next Steps

1. **Test API endpoint**: https://conbyt.com/api/health
2. **Check browser console** for errors
3. **Check Railway logs** for server errors
4. **Verify deployment** - are the latest changes deployed?
5. **Check Network tab** to see what URL is being called

## If API Health Check Works

If `https://conbyt.com/api/health` works but login doesn't:
- The server is running
- Routing is working
- Issue is likely with:
  - Database connection
  - Login endpoint specifically
  - CORS for that endpoint

## If API Health Check Doesn't Work

If `https://conbyt.com/api/health` returns 404:
- Server might not be running
- Routing might be broken
- Deployment might have failed
- Check Railway logs immediately

