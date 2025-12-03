import bcrypt from 'bcryptjs';

// Script to hash a password for database insertion
// Usage: node scripts/hash-password.js "your-password"

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-password"');
  process.exit(1);
}

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Original password:', password);
    console.log('Hashed password:', hash);
    console.log('\n📝 SQL to update your database:');
    console.log(`UPDATE admins SET hashed_password = '${hash}' WHERE email = 'admin@conbyt.com';\n`);
  })
  .catch(err => {
    console.error('Error hashing password:', err);
    process.exit(1);
  });

