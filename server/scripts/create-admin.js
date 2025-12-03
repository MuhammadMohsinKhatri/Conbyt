import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const username = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!username || !email || !password) {
    console.error('❌ Usage: node scripts/create-admin.js <username> <email> <password>');
    console.error('');
    console.error('Example:');
    console.error('  node scripts/create-admin.js admin admin@conbyt.com "MySecurePass123"');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
  }

  console.log('🔧 Creating admin profile...');
  console.log('');
  console.log('Username:', username);
  console.log('Email:', email);
  console.log('');

  try {
    // Try both table names
    const tablesToTry = process.env.ADMIN_TABLE ? [process.env.ADMIN_TABLE] : ['admin_users', 'admins'];
    let tableName = null;
    let passwordColumn = null;

    // First, check which table exists and if user already exists
    for (const table of tablesToTry) {
      try {
        const [users] = await pool.execute(
          `SELECT * FROM ${table} WHERE username = ? OR email = ?`,
          [username, email]
        );

        if (users.length > 0) {
          console.error(`❌ User with username "${username}" or email "${email}" already exists in table "${table}"`);
          process.exit(1);
        }

        // Check if table exists by trying to get its structure
        const [columns] = await pool.execute(
          `SHOW COLUMNS FROM ${table} LIKE '%password%'`
        );

        if (columns.length > 0) {
          tableName = table;
          // Determine password column name
          passwordColumn = table === 'admins' ? 'hashed_password' : 'password_hash';
          console.log(`✅ Found table: ${tableName}`);
          console.log(`✅ Using password column: ${passwordColumn}`);
          break;
        }
      } catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log(`   Table ${table} does not exist, trying next...`);
          continue;
        } else {
          throw err;
        }
      }
    }

    if (!tableName) {
      console.error('❌ No admin table found!');
      console.error('');
      console.error('Available tables:');
      try {
        const [tables] = await pool.execute(
          "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()"
        );
        tables.forEach(t => console.error('  -', t.TABLE_NAME));
      } catch (err) {
        console.error('Error fetching tables:', err.message);
      }
      console.error('');
      console.error('Please create the admin table first. Expected tables:');
      console.error('  - admin_users (with password_hash column)');
      console.error('  - admins (with hashed_password column)');
      process.exit(1);
    }

    // Hash password
    console.log('');
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    // Insert user
    console.log('');
    console.log('📝 Inserting admin user into database...');
    await pool.execute(
      `INSERT INTO ${tableName} (username, email, ${passwordColumn}) VALUES (?, ?, ?)`,
      [username, email, passwordHash]
    );

    console.log('');
    console.log('✅ Admin profile created successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('  Username:', username);
    console.log('  Email:', email);
    console.log('  Table:', tableName);
    console.log('  Password: [HIDDEN - properly hashed]');
    console.log('');
    console.log('🎉 You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error creating admin profile:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('');
      console.error('A user with this username or email already exists!');
    }
    process.exit(1);
  }
}

createAdmin();

