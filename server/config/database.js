import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u808116186_admin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u808116186_conbyt_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection (non-blocking)
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL database connection error:', err.message);
    console.error('💡 Make sure you have:');
    console.error('   1. Created a .env file in the server directory');
    console.error('   2. Set correct DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    console.error('   3. Database is accessible from your network');
    console.error('   4. For Hostinger, use the remote MySQL host (not localhost)');
  });

export default pool;

