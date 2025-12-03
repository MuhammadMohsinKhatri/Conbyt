# CMS Dashboard Setup Guide

## Prerequisites
- Node.js installed
- MySQL database (Hostinger)
- Database credentials

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_USER=u808116186_admin
DB_PASSWORD=your_database_password_here
DB_NAME=u808116186_conbyt_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Replace `your_database_password_here` with your actual Hostinger database password and set a strong `JWT_SECRET`.

## Step 3: Set Up Database

1. Connect to your MySQL database (via phpMyAdmin or MySQL client)
2. Run the SQL schema from `server/database/schema.sql` to create all tables
3. (Optional) Run the seed script to populate initial data:
   ```bash
   node server/database/seed.js
   ```

## Step 4: Create Admin User

You can create an admin user via API or directly in the database:

### Via API (First Time Setup):
```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@conbyt.com",
    "password": "your-secure-password"
  }'
```

**Note:** Disable the register endpoint in production for security.

### Via Database (Direct):
```sql
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@conbyt.com', '$2a$10$hashedpassword');
```

## Step 5: Start Backend Server

```bash
cd server
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Step 6: Access CMS Dashboard

1. Open your browser and navigate to: `http://localhost:3000/cms/login`
2. Login with your admin credentials
3. You'll be redirected to the dashboard at `/cms/dashboard`

## CMS Features

### Blog Management
- ✅ Create new blog posts with SEO fields
- ✅ Edit existing blog posts
- ✅ Delete blog posts
- ✅ Publish/Draft toggle
- ✅ Featured post option
- ✅ SEO optimization fields:
  - Meta title (60 chars recommended)
  - Meta description (160 chars recommended)
  - Meta keywords
  - OG image for social sharing
  - Canonical URL

### SEO Best Practices
- Auto-generates slug from title
- Character counters for meta fields
- Preview functionality
- Published/Draft status
- Featured post highlighting

## API Endpoints

### Public Endpoints
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `GET /api/case-studies` - Get all case studies
- `GET /api/testimonials` - Get all testimonials
- `GET /api/services` - Get all services
- `GET /api/stats` - Get all stats
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/register` - Register (disable in production)
- `GET /api/admin/auth/verify` - Verify token
- `GET /api/admin/blogs` - Get all blogs (including drafts)
- `GET /api/admin/blogs/:id` - Get blog by ID
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

## Security Notes

1. **Change JWT_SECRET** in production
2. **Disable registration endpoint** in production
3. **Use HTTPS** in production
4. **Set strong passwords** for admin accounts
5. **Limit admin user creation** to trusted personnel only

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `.env`
- Check if database host allows remote connections
- Ensure database name matches exactly

### Authentication Issues
- Check JWT_SECRET is set
- Verify token is being sent in Authorization header
- Check token expiration (default: 7 days)

### CORS Issues
- Ensure backend CORS is configured correctly
- Check frontend API URL matches backend

## Next Steps

1. Set up image upload functionality (optional)
2. Add rich text editor for blog content
3. Implement blog categories management
4. Add analytics tracking
5. Set up email notifications for contact form

