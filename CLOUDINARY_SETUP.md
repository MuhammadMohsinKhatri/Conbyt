# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials

1. After logging in, go to your Dashboard
2. You'll see your account details:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Add Environment Variables

### For Railway (Production) - RECOMMENDED

Since you're hosting on Railway, add these environment variables in your Railway project:

1. Go to your Railway project dashboard
2. Click on your service (Node.js backend)
3. Go to the **Variables** tab
4. Click **+ New Variable** and add:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. Railway will automatically redeploy your service with the new variables

**Important:** 
- These variables are encrypted in Railway
- Never commit secrets to version control
- Keep your API Secret secure

### For Local Development (Optional)

If testing locally, add these to your `.env` file in the `server/` directory:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 4: Deploy/Restart

### Railway (Production)
- Railway will automatically redeploy when you add environment variables
- Check the deployment logs to verify it's working

### Local Development
After adding the environment variables, restart your server:

```bash
cd server
npm start
```

Or if using development mode:

```bash
npm run dev
```

## Step 5: Test the Upload

1. Go to your CMS blog editor
2. Upload an image
3. Check the console logs - you should see:
   ```
   ✅ Blog image uploaded to Cloudinary:
     - Cloudinary URL: https://res.cloudinary.com/...
   ```

## How It Works

### Automatic Features

- **Image Optimization**: Images are automatically optimized for web delivery
- **CDN Delivery**: Images are served via Cloudinary's global CDN
- **Format Conversion**: Images are automatically converted to the best format (WebP when supported)
- **Responsive Images**: Images are resized to max 1200px width while maintaining aspect ratio

### Storage Structure

- **Blog Images**: Stored in `conbyt/blogs/` folder
- **Portfolio Images**: Stored in `conbyt/portfolios/` folder

### Fallback Behavior

If Cloudinary credentials are not configured, the system will automatically fall back to local file storage in the `server/uploads/` directory. This ensures your application continues to work even without Cloudinary setup.

## Troubleshooting

### Images not uploading to Cloudinary?

1. **For Railway:**
   - Check that all three environment variables are set in Railway dashboard
   - Verify they're added to the correct service (your Node.js backend)
   - Check Railway deployment logs for errors
   - Ensure Railway service has internet access

2. **For Local:**
   - Check that all three environment variables are set correctly
   - Verify your credentials in the Cloudinary dashboard
   - Check server console for error messages
   - Ensure your server has internet access to reach Cloudinary

### Getting "Invalid API credentials" error?

1. Double-check your API Key and API Secret in Cloudinary dashboard
2. **For Railway:** Make sure there are no extra spaces in the variable values
3. **For Local:** Make sure there are no extra spaces in your `.env` file
4. Restart/redeploy after updating credentials

### Images still saving locally?

- Check the server logs - you should see a warning: `⚠️ Cloudinary not configured. Falling back to local storage.`
- This means the environment variables are not being read correctly
- **For Railway:**
  - Verify variables are set in Railway dashboard (Variables tab)
  - Check that they're in the correct service
  - Redeploy after adding variables
- **For Local:**
  - Verify your `.env` file is in the `server/` directory
  - Make sure you're using `dotenv` to load environment variables
  - Restart your server after updating `.env`

## Benefits of Cloudinary

✅ **Permanent Storage**: Images are stored permanently in the cloud
✅ **Automatic Backups**: Cloudinary handles backups automatically
✅ **Fast Delivery**: Global CDN ensures fast image loading worldwide
✅ **Image Optimization**: Automatic compression and format optimization
✅ **Scalability**: Handles any amount of traffic
✅ **Free Tier**: 25GB storage and 25GB bandwidth per month (generous for most sites)

## Cost Information

- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **Paid Plans**: Start at $99/month for 100GB storage and 1TB bandwidth
- For most blogs and portfolios, the free tier is more than sufficient

## Next Steps

After setup, all new image uploads will automatically go to Cloudinary. Existing images in local storage will continue to work, but new uploads will use Cloudinary.

To migrate existing images:
1. Upload them again through the CMS
2. Or use Cloudinary's bulk upload feature
3. Update database records with new Cloudinary URLs

