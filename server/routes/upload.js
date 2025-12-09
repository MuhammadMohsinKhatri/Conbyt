import express from 'express';
import multer from 'multer';
import upload from '../middleware/upload.js';
import { authenticateAdmin } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateAdmin);

// Upload portfolio image
router.post('/portfolio-image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
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

    // Return the file path that can be used in the database
    const imageUrl = `/uploads/portfolios/${req.file.filename}`;
    
    console.log('✅ Portfolio image uploaded successfully:');
    console.log('  - Filename:', req.file.filename);
    console.log('  - Original name:', req.file.originalname);
    console.log('  - Size:', req.file.size, 'bytes');
    console.log('  - Image URL:', imageUrl);
    console.log('  - File saved to:', req.file.path);
    
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

// Upload general image (for future use)
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
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
router.delete('/image', authenticateAdmin, (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    // Convert URL to file path
    const filename = path.basename(imageUrl);
    const directory = imageUrl.includes('/portfolios/') ? 'portfolios' : '';
    const filePath = path.join(process.cwd(), 'uploads', directory, filename);
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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
