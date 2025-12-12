import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Create Cloudinary storage for general images (blogs, etc.)
export const blogImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'conbyt/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
    ],
    resource_type: 'image'
  }
});

// Create Cloudinary storage for portfolio images
export const portfolioImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'conbyt/portfolios',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
    ],
    resource_type: 'image'
  }
});

// Create multer instances
export const uploadBlogImage = multer({
  storage: blogImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (Cloudinary can handle larger files)
  }
});

export const uploadPortfolioImage = multer({
  storage: portfolioImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to local storage if Cloudinary is not configured
const createLocalStorage = () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const portfolioUploadsDir = path.join(uploadsDir, 'portfolios');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(portfolioUploadsDir)) {
    fs.mkdirSync(portfolioUploadsDir, { recursive: true });
  }
  
  return multer.diskStorage({
    destination: (req, file, cb) => {
      // Determine upload directory based on upload type
      let uploadPath = uploadsDir;
      if (req.path?.includes('portfolio') || req.url?.includes('portfolio') || req.originalUrl?.includes('portfolio')) {
        uploadPath = portfolioUploadsDir;
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `image-${uniqueSuffix}${extension}`);
    }
  });
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Export upload instances based on configuration
export const getUploadInstance = (type = 'blog') => {
  if (isCloudinaryConfigured()) {
    return type === 'portfolio' ? uploadPortfolioImage : uploadBlogImage;
  } else {
    console.warn('⚠️  Cloudinary not configured. Falling back to local storage.');
    const storage = createLocalStorage();
    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for local storage
      }
    });
  }
};

export default {
  uploadBlogImage,
  uploadPortfolioImage,
  getUploadInstance,
  isCloudinaryConfigured
};

