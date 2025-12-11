import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function setAdminRole() {
  try {
    console.log('🔄 Setting admin role for admin@conbyt.com...');

    // First, ensure the role column exists
    try {
      await pool.execute(`
        ALTER TABLE admin_users 
        ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
        DEFAULT 'task_creator'
      `);
      console.log('✅ Role column added to admin_users');
    } catch (error) {
      if (error.message.includes('Duplicate column name') || error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Role column already exists');
      } else {
        // Try MySQL syntax (doesn't support IF NOT EXISTS for ALTER TABLE)
        try {
          await pool.execute(`
            ALTER TABLE admin_users 
            ADD COLUMN role ENUM('admin', 'task_manager', 'task_creator') 
            DEFAULT 'task_creator'
          `);
          console.log('✅ Role column added to admin_users');
        } catch (err) {
          if (err.message.includes('Duplicate column name') || err.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️  Role column already exists');
          } else {
            throw err;
          }
        }
      }
    }

    // Update the admin user's role
    const [result] = await pool.execute(
      `UPDATE admin_users SET role = 'admin' WHERE email = ? OR username = ?`,
      ['admin@conbyt.com', 'admin@conbyt.com']
    );

    if (result.affectedRows > 0) {
      console.log('✅ Successfully set admin role for admin@conbyt.com');
      
      // Verify the update
      const [users] = await pool.execute(
        'SELECT id, username, email, role FROM admin_users WHERE email = ?',
        ['admin@conbyt.com']
      );
      
      if (users.length > 0) {
        console.log('📋 User details:');
        console.log(`   ID: ${users[0].id}`);
        console.log(`   Username: ${users[0].username}`);
        console.log(`   Email: ${users[0].email}`);
        console.log(`   Role: ${users[0].role || 'task_creator'}`);
      }
    } else {
      console.log('⚠️  No user found with email admin@conbyt.com');
      console.log('   Please check the email address or create the user first.');
      
      // List all users
      const [allUsers] = await pool.execute(
        'SELECT id, username, email, role FROM admin_users LIMIT 10'
      );
      if (allUsers.length > 0) {
        console.log('\n📋 Existing users:');
        allUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.username}) - Role: ${user.role || 'task_creator'}`);
        });
      }
    }

    console.log('\n✅ Script completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setAdminRole();

