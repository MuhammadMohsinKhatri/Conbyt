import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'u808116186_admin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'u808116186_conbyt_db',
    port: process.env.DB_PORT || 3306
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Password: ${config.password ? '***' : 'NOT SET'}\n`);

  if (!config.password) {
    console.error('❌ DB_PASSWORD is not set in .env file!');
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    // Check if tables exist
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [config.database]
    );
    
    console.log(`\n📊 Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    
    await connection.end();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your .env file exists in server/ directory');
    console.error('   2. Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are correct');
    console.error('   3. For Hostinger, use the remote MySQL host (not localhost)');
    console.error('   4. Enable Remote MySQL access in Hostinger panel');
    console.error('   5. Check if database exists in Hostinger');
    process.exit(1);
  }
}

testConnection();

