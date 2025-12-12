import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🔄 Starting migration: Add focus_keyword column to blog_posts...\n');

    // Add focus_keyword column to blog_posts table
    console.log('📋 Adding focus_keyword column to blog_posts...');
    try {
      await pool.execute(`
        ALTER TABLE blog_posts 
        ADD COLUMN focus_keyword VARCHAR(255) NULL AFTER meta_keywords
      `);
      console.log('✅ focus_keyword column added successfully!');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || 
          error.code === 'ER_DUP_FIELDNAME' || 
          error.code === 'ER_DUP_FIELD_ERROR' || 
          error.errno === 1060) {
        console.log('ℹ️  focus_keyword column already exists - no changes needed');
      } else {
        console.error('❌ Error adding focus_keyword column:', error.message);
        throw error;
      }
    }

    // Verify the column was added
    try {
      const [columns] = await pool.execute(`
        SHOW COLUMNS FROM blog_posts LIKE 'focus_keyword'
      `);
      
      if (columns.length > 0) {
        console.log('\n✅ Migration completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   - focus_keyword column added/verified in blog_posts table');
        console.log('\n🔄 Please restart your server for changes to take effect.');
        console.log('💡 Focus keywords will now be saved when editing blog posts.');
      } else {
        console.log('⚠️  Warning: Column may not have been added. Please check manually.');
      }
    } catch (error) {
      console.log('⚠️  Could not verify column, but migration may have succeeded.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();

