# Conbyt CMS Dashboard

A complete Content Management System for managing SEO-friendly blog posts on the Conbyt website.

## Features

✅ **Complete Blog Management**
- Create, edit, and delete blog posts
- Rich content editor
- Image URL support
- Category management
- Author information

✅ **SEO Optimization**
- Meta title (with character counter)
- Meta description (with character counter)
- Meta keywords
- OG image for social sharing
- Canonical URL
- Auto-generated SEO-friendly slugs

✅ **Publishing Controls**
- Draft/Published status
- Featured post option
- Date management
- Read time estimation

✅ **Secure Authentication**
- JWT-based authentication
- Protected admin routes
- Secure password hashing

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_USER=u808116186_admin
DB_PASSWORD=your_password
DB_NAME=u808116186_conbyt_db
DB_PORT=3306
PORT=5000
JWT_SECRET=your-secret-key
```

### 2. Database Setup

Run the SQL schema:
```bash
# Connect to MySQL and run:
mysql -u u808116186_admin -p u808116186_conbyt_db < server/database/schema.sql
```

### 3. Create Admin User

```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@conbyt.com",
    "password": "securepassword123"
  }'
```

### 4. Start Server

```bash
cd server
npm start
```

### 5. Access CMS

Navigate to: `http://localhost:3000/cms/login`

## CMS Dashboard Routes

- `/cms/login` - Login page
- `/cms/dashboard` - Main dashboard (blog list)
- `/cms/blogs/new` - Create new blog post
- `/cms/blogs/edit/:id` - Edit existing blog post

## SEO Features

The CMS includes comprehensive SEO fields:

1. **Meta Title** - Optimized for search engines (50-60 characters)
2. **Meta Description** - Compelling description for search results (150-160 characters)
3. **Meta Keywords** - Comma-separated keywords
4. **OG Image** - Social media sharing image (1200x630px recommended)
5. **Canonical URL** - Preferred URL for content
6. **Auto-generated Slug** - SEO-friendly URL from title

## Blog Post Structure

Each blog post includes:
- Title and excerpt
- Full content (supports HTML/Markdown)
- Featured image
- Category
- Author name and avatar
- Publication date
- Read time
- SEO metadata
- Publishing status (Draft/Published)
- Featured flag

## API Documentation

See `server/CMS_SETUP.md` for complete API documentation.

## Security

- JWT authentication for all admin routes
- Password hashing with bcrypt
- Protected API endpoints
- CORS configuration

## Next Steps

1. Set up image upload (currently uses URLs)
2. Add rich text editor (TinyMCE, CKEditor, etc.)
3. Implement blog categories management
4. Add analytics integration
5. Set up email notifications

