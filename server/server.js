import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import caseStudiesRoutes from './routes/caseStudies.js';
import blogsRoutes from './routes/blogs.js';
import testimonialsRoutes from './routes/testimonials.js';
import servicesRoutes from './routes/services.js';
import statsRoutes from './routes/stats.js';
import contactRoutes from './routes/contact.js';
import adminAuthRoutes from './routes/admin/auth.js';
import adminBlogsRoutes from './routes/admin/blogs.js';
import adminContactRoutes from './routes/admin/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://conbyt.com', 'https://www.conbyt.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/blogs', adminBlogsRoutes);
app.use('/api/admin/contact', adminContactRoutes);

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
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

