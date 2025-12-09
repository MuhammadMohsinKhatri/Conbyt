import dotenv from 'dotenv';
import pool from '../config/database.js';
import { ensureBlogPostsColumns } from '../utils/migrateColumns.js';

dotenv.config();

async function runMigration() {
  try {
    console.log('🔄 Running blog_posts table migration...');
    const addedCount = await ensureBlogPostsColumns();
    
    if (addedCount > 0) {
      console.log(`✅ Migration completed: Added ${addedCount} column(s)`);
    } else {
      console.log('✅ All required columns already exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();

