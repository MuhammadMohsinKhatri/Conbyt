import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool from './config/database.js';
import caseStudiesRoutes from './routes/caseStudies.js';
import blogsRoutes from './routes/blogs.js';
import testimonialsRoutes from './routes/testimonials.js';
import servicesRoutes from './routes/services.js';
import statsRoutes from './routes/stats.js';
import contactRoutes from './routes/contact.js';
import adminAuthRoutes from './routes/admin/auth.js';
import adminBlogsRoutes from './routes/admin/blogs.js';
import adminContactRoutes from './routes/admin/contact.js';
import adminClientsRoutes from './routes/admin/clients.js';
import adminProjectsRoutes from './routes/admin/projects.js';
import adminMilestonesRoutes from './routes/admin/milestones.js';
import adminPaymentsRoutes from './routes/admin/payments.js';
import adminPortfoliosRoutes from './routes/admin/portfolios.js';
import adminTasksRoutes from './routes/admin/tasks.js';
import adminUsersRoutes from './routes/admin/users.js';
import portfoliosRoutes from './routes/portfolios.js';
import pagesRoutes from './routes/pages.js';
import uploadRoutes from './routes/upload.js';
import { ensureBlogPostsColumns } from './utils/migrateColumns.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Redirect www.conbyt.com to conbyt.com
app.use((req, res, next) => {
  const host = req.get('host') || req.get('x-forwarded-host') || '';
  
  // Check if the request is coming from www.conbyt.com
  if (host.startsWith('www.conbyt.com')) {
    // Preserve the protocol (http/https)
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    // Preserve the path and query string
    const url = req.originalUrl || req.url;
    // Redirect to non-www version
    return res.redirect(301, `${protocol}://conbyt.com${url}`);
  }
  
  next();
});

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In production, allow specific domains
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://conbyt.com', 
        'https://www.conbyt.com',
        process.env.RAILWAY_PUBLIC_DOMAIN,
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      // Also allow same-origin requests (when frontend and backend are on same domain)
      if (allowedOrigins.some(allowed => origin.includes(allowed.replace(/https?:\/\//, '')))) {
        return callback(null, true);
      }
      
      // Check if origin matches the server's own domain (same-origin)
      const serverUrl = process.env.RAILWAY_PUBLIC_DOMAIN || 'conbyt.com';
      if (origin.includes(serverUrl.replace(/https?:\/\//, ''))) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    } else {
      // In development, allow common dev ports
      const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080'
      ];
      
      if (allowedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (both development and production)
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolios', portfoliosRoutes);
app.use('/api/pages', pagesRoutes);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/blogs', adminBlogsRoutes);
app.use('/api/admin/contact', adminContactRoutes);
app.use('/api/admin/clients', adminClientsRoutes);
app.use('/api/admin/projects', adminProjectsRoutes);
app.use('/api/admin/milestones', adminMilestonesRoutes);
app.use('/api/admin/payments', adminPaymentsRoutes);
app.use('/api/admin/portfolios', adminPortfoliosRoutes);
app.use('/api/admin/tasks', adminTasksRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/upload', uploadRoutes);

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Conbyt API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      blogs: '/api/blogs',
      caseStudies: '/api/case-studies',
      testimonials: '/api/testimonials',
      services: '/api/services',
      stats: '/api/stats',
      contact: '/api/contact',
      admin: {
        auth: '/api/admin/auth',
        blogs: '/api/admin/blogs'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Helper function to safely parse and format dates
function safeFormatDate(dateValue, fallbackDate) {
  if (!dateValue) return fallbackDate;
  try {
    const date = new Date(dateValue);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallbackDate;
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    return fallbackDate;
  }
}

// Test endpoint to debug sitemap
app.get('/api/test-sitemap-data', async (req, res) => {
  try {
    // Test blog posts
    const [blogRows] = await pool.execute(`
      SELECT slug, published, is_published
      FROM blog_posts 
      WHERE (published = true OR published = 1) 
      OR (is_published = true OR is_published = 1)
    `);
    
    // Test case studies
    const [caseStudyRows] = await pool.execute(`
      SELECT slug, is_published
      FROM case_studies 
      WHERE is_published = true OR is_published = 1
    `);
    
    res.json({
      blogPosts: blogRows,
      caseStudies: caseStudyRows,
      totalUrls: 8 + blogRows.length + caseStudyRows.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test sitemap generation
app.get('/api/test-sitemap-xml', async (req, res) => {
  try {
    const baseUrl = 'https://conbyt.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/case-studies', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' }
    ];

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add dynamic blog posts
    const [blogRows] = await pool.execute(`
      SELECT slug, updated_at, created_at 
      FROM blog_posts 
      WHERE (published = true OR published = 1) 
      OR (is_published = true OR is_published = 1)
    `);
    
    console.log(`📝 TEST: Found ${blogRows.length} published blog posts for sitemap`);
    blogRows.forEach(blog => {
      const blogDate = safeFormatDate(blog.updated_at, safeFormatDate(blog.created_at, currentDate));
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blogDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add dynamic case studies
    const [caseStudyRows] = await pool.execute(`
      SELECT slug, updated_at, created_at 
      FROM case_studies 
      WHERE is_published = true OR is_published = 1
    `);
    
    console.log(`📁 TEST: Found ${caseStudyRows.length} published case studies for sitemap`);
    caseStudyRows.forEach(caseStudy => {
      const caseStudyDate = safeFormatDate(caseStudy.updated_at, safeFormatDate(caseStudy.created_at, currentDate));
      sitemap += `
  <url>
    <loc>${baseUrl}/case-study/${caseStudy.slug}</loc>
    <lastmod>${caseStudyDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating test sitemap:', error);
    res.status(500).send('Error generating test sitemap');
  }
});

// Define distPath for production use
const distPath = path.join(__dirname, '..', 'dist');

// Serve static files from React app (production)
if (process.env.NODE_ENV === 'production') {
  
  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error(`❌ ERROR: dist folder not found at ${distPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    console.error(`NODE_ENV: ${process.env.NODE_ENV}`);
  } else {
    console.log(`✅ Serving static files from: ${distPath}`);
    try {
      const files = fs.readdirSync(distPath);
      console.log(`📁 Files in dist: ${files.join(', ')}`);
      
      // Check if index.html exists
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`✅ index.html found at: ${indexPath}`);
      } else {
        console.error(`❌ index.html NOT found at: ${indexPath}`);
      }
    } catch (err) {
      console.error(`❌ Error reading dist folder:`, err);
    }
  }
  
  // Serve static files (CSS, JS, images, etc.) but exclude sitemap.xml
  app.use(express.static(distPath, {
    index: false, // Don't serve index.html automatically, we'll handle it
    extensions: ['html', 'htm'],
    // Don't serve static sitemap.xml - we generate it dynamically
    setHeaders: (res, path) => {
      if (path.endsWith('sitemap.xml')) {
        res.status(404).end();
      }
    }
  }));
  
  // Serve index.html for root path
  app.get('/', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at ${indexPath}`);
      res.status(404).send(`
        <html>
          <body>
            <h1>404 - File Not Found</h1>
            <p>index.html not found at: ${indexPath}</p>
            <p>Dist path: ${distPath}</p>
            <p>Current dir: ${process.cwd()}</p>
            <p>NODE_ENV: ${process.env.NODE_ENV}</p>
          </body>
        </html>
      `);
    }
  });

} else {
  console.log('⚠️  NODE_ENV is not "production", static files will not be served');
  console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
}

// Dynamic sitemap generation (available in all environments) - MUST be before catch-all route
app.get('/sitemap.xml', async (req, res) => {
  try {
    console.log('🌐 Generating sitemap...');
    const baseUrl = 'https://conbyt.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/case-studies', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/services', priority: '0.8', changefreq: 'monthly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
      { url: '/terms-of-service', priority: '0.3', changefreq: 'monthly' }
    ];

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add dynamic blog posts
    try {
      const [blogRows] = await pool.execute(`
        SELECT slug, updated_at, created_at 
        FROM blog_posts 
        WHERE (published = 1) OR (is_published = 1)
      `);
      console.log(`📝 Found ${blogRows.length} published blog posts for sitemap`);
      blogRows.forEach(blog => {
        try {
          const blogDate = safeFormatDate(blog.updated_at, safeFormatDate(blog.created_at, currentDate));
          sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blogDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        } catch (itemError) {
          console.log(`⚠️ Skipping blog post ${blog.slug} due to date error:`, itemError.message);
          // Use fallback date for this item
          sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    } catch (error) {
      console.log('❌ Could not fetch blogs for sitemap:', error.message);
    }

    // Add dynamic case studies
    try {
      const [caseStudyRows] = await pool.execute(`
        SELECT slug, updated_at, created_at 
        FROM case_studies 
        WHERE is_published = 1
      `);
      console.log(`📁 Found ${caseStudyRows.length} published case studies for sitemap`);
      caseStudyRows.forEach(caseStudy => {
        try {
          const caseStudyDate = safeFormatDate(caseStudy.updated_at, safeFormatDate(caseStudy.created_at, currentDate));
          sitemap += `
  <url>
    <loc>${baseUrl}/case-study/${caseStudy.slug}</loc>
    <lastmod>${caseStudyDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        } catch (itemError) {
          console.log(`⚠️ Skipping case study ${caseStudy.slug} due to date error:`, itemError.message);
          // Use fallback date for this item
          sitemap += `
  <url>
    <loc>${baseUrl}/case-study/${caseStudy.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    } catch (error) {
      console.log('❌ Could not fetch case studies for sitemap:', error.message);
    }

    sitemap += `
</urlset>`;

    console.log('✅ Sitemap generated successfully');
    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Handle React routing - return all non-API requests to React app (MUST be after sitemap route)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at ${indexPath} for path: ${req.path}`);
      res.status(404).send(`
        <html>
          <body>
            <h1>404 - File Not Found</h1>
            <p>index.html not found at: ${indexPath}</p>
            <p>Requested path: ${req.path}</p>
            <p>Dist path: ${distPath}</p>
            <p>Current dir: ${process.cwd()}</p>
          </body>
        </html>
      `);
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Ensure database columns exist before starting server
ensureBlogPostsColumns()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`🌐 Serving static files from dist/`);
      }
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });

