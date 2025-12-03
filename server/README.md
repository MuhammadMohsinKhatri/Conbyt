# Conbyt Backend Server

Node.js backend server with Express and MySQL for the Conbyt website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=u808116186_admin
DB_PASSWORD=your_password_here
DB_NAME=u808116186_conbyt_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
```

3. Set up the database:
   - Run the SQL schema from `database/schema.sql` in your MySQL database
   - Or use the database initialization script

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:slug` - Get case study by slug
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:slug` - Get blog post by slug
- `GET /api/testimonials` - Get all testimonials
- `GET /api/services` - Get all services
- `GET /api/stats` - Get all stats
- `POST /api/contact` - Submit contact form

## Database Schema

The database includes tables for:
- Case studies
- Blog posts
- Testimonials
- Services
- Stats
- Contact submissions

