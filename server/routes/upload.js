import express from 'express';
import multer from 'multer';
import { authenticateAdmin } from '../middleware/auth.js';
import { getUploadInstance, isCloudinaryConfigured } from '../middleware/cloudinaryStorage.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// All upload routes require authentication
router.use(authenticateAdmin);

// Upload portfolio image
router.post('/portfolio-image', (req, res, next) => {
  const upload = getUploadInstance('portfolio');
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      // Handle other errors (e.g., file type validation)
      return res.status(400).json({ error: err.message || 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let imageUrl;
    
    if (isCloudinaryConfigured() && req.file.path) {
      // Cloudinary returns the secure URL in req.file.path
      imageUrl = req.file.path;
      
      console.log('✅ Portfolio image uploaded to Cloudinary:');
      console.log('  - Cloudinary URL:', imageUrl);
      console.log('  - Public ID:', req.file.filename);
      console.log('  - Original name:', req.file.originalname);
      console.log('  - Size:', req.file.size, 'bytes');
    } else {
      // Fallback to local storage
      imageUrl = `/uploads/portfolios/${req.file.filename}`;
      
      console.log('✅ Portfolio image uploaded locally:');
      console.log('  - Filename:', req.file.filename);
      console.log('  - Original name:', req.file.originalname);
      console.log('  - Size:', req.file.size, 'bytes');
      console.log('  - Image URL:', imageUrl);
      console.log('  - File saved to:', req.file.path);
    }
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading portfolio image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload general image (for blogs, etc.)
router.post('/image', (req, res, next) => {
  const upload = getUploadInstance('blog');
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      // Handle other errors (e.g., file type validation)
      return res.status(400).json({ error: err.message || 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let imageUrl;
    
    if (isCloudinaryConfigured() && req.file.path) {
      // Cloudinary returns the secure URL in req.file.path
      imageUrl = req.file.path;
      
      console.log('✅ Blog image uploaded to Cloudinary:');
      console.log('  - Cloudinary URL:', imageUrl);
      console.log('  - Public ID:', req.file.filename);
      console.log('  - Original name:', req.file.originalname);
      console.log('  - Size:', req.file.size, 'bytes');
    } else {
      // Fallback to local storage
      imageUrl = `/uploads/${req.file.filename}`;
      
      console.log('✅ Blog image uploaded locally:');
      console.log('  - Filename:', req.file.filename);
      console.log('  - Original name:', req.file.originalname);
      console.log('  - Size:', req.file.size, 'bytes');
      console.log('  - Image URL:', imageUrl);
      console.log('  - File saved to:', req.file.path);
    }
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image (cleanup when portfolio is deleted)
router.delete('/image', authenticateAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Check if it's a Cloudinary URL
    if (isCloudinaryConfigured() && (imageUrl.includes('cloudinary.com') || imageUrl.includes('res.cloudinary.com'))) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}
      const urlParts = imageUrl.split('/upload/');
      if (urlParts.length > 1) {
        const publicIdWithExt = urlParts[1].split('.')[0]; // Remove extension
        const publicId = publicIdWithExt.replace(/^v\d+\//, ''); // Remove version prefix if present
        
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result === 'ok') {
            console.log('✅ Image deleted from Cloudinary:', publicId);
            return res.json({ success: true, message: 'Image deleted successfully from Cloudinary' });
          } else {
            console.warn('⚠️  Cloudinary deletion result:', result);
            return res.status(404).json({ error: 'Image not found in Cloudinary' });
          }
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
          return res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
        }
      }
    }
    
    // Fallback to local file deletion
    if (!imageUrl.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Invalid image URL format' });
    }

    // Convert URL to file path
    const filename = path.basename(imageUrl);
    const directory = imageUrl.includes('/portfolios/') ? 'portfolios' : '';
    const filePath = path.join(__dirname, '..', 'uploads', directory, filename);
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Local image deleted:', filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
