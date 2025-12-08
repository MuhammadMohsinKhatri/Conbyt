import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateImageColumns() {
  try {
    console.log('🔄 Updating image_url columns to support file paths...');

    // Update portfolios table
    await pool.execute(`
      ALTER TABLE portfolios 
      MODIFY COLUMN image_url VARCHAR(500)
    `);
    console.log('✅ Updated portfolios.image_url column');

    // Update other tables that might have image_url columns
    const tables = ['case_studies', 'blog_posts'];
    
    for (const table of tables) {
      try {
        await pool.execute(`
          ALTER TABLE ${table} 
          MODIFY COLUMN image_url VARCHAR(500)
        `);
        console.log(`✅ Updated ${table}.image_url column`);
      } catch (error) {
        console.log(`ℹ️  ${table}.image_url column already correct or doesn't exist`);
      }
    }

    console.log('✅ All image_url columns updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating image columns:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
updateImageColumns()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
