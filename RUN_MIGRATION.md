# How to Run the Database Migration

## ❌ Don't Do This
```bash
python server/database/migrations/add_focus_keyword.sql  # ❌ WRONG - SQL files can't be run with Python
```

## ✅ Correct Methods

### Method 1: phpMyAdmin (Recommended for Hostinger)

1. **Log in to Hostinger Control Panel**
   - Go to your Hostinger account
   - Navigate to phpMyAdmin

2. **Select Your Database**
   - Click on `u808116186_conbyt_db` in the left sidebar

3. **Open SQL Tab**
   - Click on the "SQL" tab at the top

4. **Paste and Run This SQL:**
   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN focus_keyword VARCHAR(255) NULL AFTER meta_keywords;
   ```

5. **Click "Go"**
   - The column will be added to your table

### Method 2: MySQL Command Line

If you have MySQL command line access:

```bash
# Connect to MySQL
mysql -u u808116186_admin -p

# Enter your database password when prompted

# Then run:
USE u808116186_conbyt_db;

ALTER TABLE blog_posts 
ADD COLUMN focus_keyword VARCHAR(255) NULL AFTER meta_keywords;

# Verify it worked:
DESCRIBE blog_posts;

# You should see focus_keyword in the column list
```

### Method 3: Node.js Script (If you prefer)

You could also create a simple Node.js script to run the migration:

```javascript
// run-migration.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await connection.execute(`
      ALTER TABLE blog_posts 
      ADD COLUMN focus_keyword VARCHAR(255) NULL AFTER meta_keywords
    `);
    console.log('✅ Migration successful! focus_keyword column added.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists. No changes needed.');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  } finally {
    await connection.end();
  }
}

runMigration();
```

Then run:
```bash
node run-migration.js
```

## Verify the Migration

After running the migration, verify it worked:

```sql
-- In phpMyAdmin SQL tab or MySQL command line:
DESCRIBE blog_posts;

-- Or:
SHOW COLUMNS FROM blog_posts LIKE 'focus_keyword';
```

You should see `focus_keyword` in the column list.

## What This Migration Does

- Adds a new column `focus_keyword` to the `blog_posts` table
- Allows NULL values (so existing posts won't break)
- Places it after the `meta_keywords` column
- Stores the focus keyword that users enter in the SEO plugin

## After Migration

Once the migration is complete:
1. Restart your Node.js server (if running)
2. The focus keyword will now be saved when you edit blog posts
3. Previously saved focus keywords will persist when you edit again

