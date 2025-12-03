import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function verifyUser() {
  const email = process.argv[2] || 'admin@conbyt.com';
  
  console.log('🔍 Checking for user:', email);
  console.log('');

  // Try both table names
  const tablesToTry = ['admins', 'admin_users'];
  
  for (const tableName of tablesToTry) {
    try {
      console.log(`Checking table: ${tableName}...`);
      const [users] = await pool.execute(
        `SELECT * FROM ${tableName} WHERE email = ? OR username = ?`,
        [email, email]
      );

      if (users.length > 0) {
        const user = users[0];
        console.log('✅ User found!');
        console.log('');
        console.log('User details:');
        console.log('  ID:', user.id);
        console.log('  Username:', user.username);
        console.log('  Email:', user.email);
        console.log('  Password field:', user.password_hash ? 'password_hash' : user.hashed_password ? 'hashed_password' : 'NOT FOUND');
        console.log('  Password value:', user.password_hash || user.hashed_password || 'NONE');
        console.log('  Password is hashed:', (user.password_hash || user.hashed_password || '').startsWith('$2'));
        console.log('');
        
        if (!user.password_hash && !user.hashed_password) {
          console.log('❌ ERROR: No password field found!');
        } else if (!(user.password_hash || user.hashed_password).startsWith('$2')) {
          console.log('⚠️  WARNING: Password is stored as plain text!');
          console.log('   Run: npm run hash-password "your-password" to get the hash');
        } else {
          console.log('✅ Password is properly hashed');
        }
        
        process.exit(0);
      } else {
        console.log(`   No user found in ${tableName}`);
      }
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        console.log(`   Table ${tableName} does not exist`);
      } else {
        console.error(`   Error checking ${tableName}:`, err.message);
      }
    }
  }
  
  console.log('');
  console.log('❌ User not found in any table!');
  console.log('');
  console.log('Available tables:');
  try {
    const [tables] = await pool.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()"
    );
    tables.forEach(t => console.log('  -', t.TABLE_NAME));
  } catch (err) {
    console.error('Error fetching tables:', err.message);
  }
  
  process.exit(1);
}

verifyUser();

