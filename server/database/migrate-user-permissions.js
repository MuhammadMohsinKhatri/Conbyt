import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🔄 Starting migration: Create user_permissions table...\n');

    // Create user_permissions table
    console.log('📋 Creating user_permissions table...');
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS user_permissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          section VARCHAR(50) NOT NULL,
          permissions JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_section (user_id, section),
          INDEX idx_user_id (user_id),
          INDEX idx_section (section)
        )
      `);
      console.log('✅ user_permissions table created successfully!');
    } catch (error) {
      // Try without foreign key if it fails (in case admin_users table structure is different)
      if (error.message.includes('foreign key') || error.code === 'ER_CANNOT_ADD_FOREIGN') {
        console.log('⚠️  Foreign key constraint failed, trying without foreign key...');
        try {
          await pool.execute(`
            CREATE TABLE IF NOT EXISTS user_permissions (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              section VARCHAR(50) NOT NULL,
              permissions JSON NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              UNIQUE KEY unique_user_section (user_id, section),
              INDEX idx_user_id (user_id),
              INDEX idx_section (section)
            )
          `);
          console.log('✅ user_permissions table created without foreign key!');
        } catch (err) {
          console.error('❌ Error creating user_permissions table:', err.message);
          throw err;
        }
      } else if (error.message.includes('already exists') || error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('ℹ️  user_permissions table already exists - no changes needed');
      } else {
        console.error('❌ Error creating user_permissions table:', error.message);
        throw error;
      }
    }

    // Verify the table was created
    try {
      const [tables] = await pool.execute(`
        SHOW TABLES LIKE 'user_permissions'
      `);
      
      if (tables.length > 0) {
        console.log('\n✅ Migration completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   - user_permissions table created/verified');
        console.log('\n🔄 Please restart your server for changes to take effect.');
        console.log('💡 Section-based permissions are now available.');
      } else {
        console.log('⚠️  Warning: Table may not have been created. Please check manually.');
      }
    } catch (error) {
      console.log('⚠️  Could not verify table, but migration may have succeeded.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();

