import pool from '../config/database.js';

// Define all columns that should exist in blog_posts table
const requiredColumns = [
  { name: 'image_url', type: 'VARCHAR(500)', after: 'content' },
  { name: 'meta_title', type: 'VARCHAR(255)', after: 'slug' },
  { name: 'meta_description', type: 'TEXT', after: 'meta_title' },
  { name: 'meta_keywords', type: 'VARCHAR(500)', after: 'meta_description' },
  { name: 'og_image', type: 'VARCHAR(500)', after: 'meta_keywords' },
  { name: 'canonical_url', type: 'VARCHAR(500)', after: 'og_image' },
  { name: 'published', type: 'BOOLEAN DEFAULT FALSE', after: 'canonical_url' },
  { name: 'featured', type: 'BOOLEAN DEFAULT FALSE', after: 'published' },
];

export async function ensureBlogPostsColumns() {
  let connection;
  try {
    connection = await pool.getConnection();
    const dbName = process.env.DB_NAME || 'u808116186_conbyt_db';
    
    // Get existing columns
    const [existingColumns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'blog_posts'
    `, [dbName]);
    
    const existingColumnNames = existingColumns.map(col => col.COLUMN_NAME.toLowerCase());
    let addedCount = 0;
    
    // Check and add each required column
    for (const column of requiredColumns) {
      const columnNameLower = column.name.toLowerCase();
      
      if (existingColumnNames.includes(columnNameLower)) {
        continue; // Column already exists
      }
      
      try {
        await connection.query(`
          ALTER TABLE blog_posts 
          ADD COLUMN ${column.name} ${column.type} ${column.after ? `AFTER ${column.after}` : ''}
        `);
        console.log(`✅ Added missing column: ${column.name}`);
        addedCount++;
      } catch (error) {
        // If column already exists (race condition), that's okay
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.error(`⚠️  Error adding column ${column.name}:`, error.message);
        }
      }
    }
    
    if (addedCount > 0) {
      console.log(`✅ Database migration: Added ${addedCount} missing column(s) to blog_posts table`);
    }
    
    return addedCount;
  } catch (error) {
    console.error('⚠️  Error checking database columns:', error.message);
    // Don't throw - allow server to start even if migration fails
    return 0;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

