import pool from '../config/database.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define columns that should exist in each table (for existing tables)
const tableColumns = {
  blog_posts: [
    { name: 'image_url', type: 'VARCHAR(500)', after: 'content' },
    { name: 'meta_title', type: 'VARCHAR(255)', after: 'slug' },
    { name: 'meta_description', type: 'TEXT', after: 'meta_title' },
    { name: 'meta_keywords', type: 'VARCHAR(500)', after: 'meta_description' },
    { name: 'og_image', type: 'VARCHAR(500)', after: 'meta_keywords' },
    { name: 'canonical_url', type: 'VARCHAR(500)', after: 'og_image' },
    { name: 'published', type: 'BOOLEAN DEFAULT FALSE', after: 'canonical_url' },
    { name: 'featured', type: 'BOOLEAN DEFAULT FALSE', after: 'published' },
  ],
};

async function ensureTableColumns(connection, tableName, requiredColumns) {
  const dbName = process.env.DB_NAME || 'u808116186_conbyt_db';
  
  try {
    // Get existing columns
    const [existingColumns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = ?
    `, [dbName, tableName]);
    
    const existingColumnNames = existingColumns.map(col => col.COLUMN_NAME.toLowerCase());
    let addedCount = 0;
    
    // Check and add each required column
    for (const column of requiredColumns) {
      const columnNameLower = column.name.toLowerCase();
      
      if (existingColumnNames.includes(columnNameLower)) {
        continue; // Column already exists
      }
      
      try {
        await connection.query(`
          ALTER TABLE ${tableName} 
          ADD COLUMN ${column.name} ${column.type} ${column.after ? `AFTER ${column.after}` : ''}
        `);
        console.log(`   ✅ Added missing column: ${tableName}.${column.name}`);
        addedCount++;
      } catch (error) {
        // If column already exists (race condition), that's okay
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.error(`   ⚠️  Error adding column ${tableName}.${column.name}:`, error.message);
        }
      }
    }
    
    return addedCount;
  } catch (error) {
    console.error(`   ⚠️  Error checking columns for ${tableName}:`, error.message);
    return 0;
  }
}

async function runMigration() {
  let connection;
  try {
    console.log('🔄 Starting database migration...');
    
    // Read the schema.sql file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('✅ Database connection established');
    
    // Remove comments and split by semicolons
    const cleanedSQL = schemaSQL
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('--');
      })
      .join('\n');
    
    // Split into individual statements
    const statements = cleanedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    let executedCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.length === 0) {
        continue;
      }
      
      try {
        await connection.query(statement);
        executedCount++;
        // Extract table name, handling "IF NOT EXISTS" clause
        const tableMatch = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?(\w+)`?/i);
        const tableName = tableMatch?.[1] || (statement.match(/USE\s+`?(\w+)`?/i)?.[1] || 'statement');
        console.log(`✅ [${executedCount}/${statements.length}] Executed: ${tableName}`);
      } catch (error) {
        // If table already exists, that's okay (IF NOT EXISTS handles this)
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.message.includes('already exists') ||
            error.code === 'ER_DUP_ENTRY') {
          const tableMatch = statement.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?(\w+)`?/i);
          const tableName = tableMatch?.[1] || 'table';
          console.log(`⚠️  [${i + 1}/${statements.length}] ${tableName} already exists (skipped)`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.error(`   Error code: ${error.code}`);
          const preview = statement.substring(0, 150).replace(/\n/g, ' ');
          console.error(`   Statement preview: ${preview}...`);
          throw error;
        }
      }
    }
    
    // Check and add missing columns to existing tables
    console.log('\n🔍 Checking for missing columns in existing tables...');
    let totalColumnsAdded = 0;
    
    for (const [tableName, requiredColumns] of Object.entries(tableColumns)) {
      const added = await ensureTableColumns(connection, tableName, requiredColumns);
      totalColumnsAdded += added;
    }
    
    if (totalColumnsAdded > 0) {
      console.log(`\n✅ Added ${totalColumnsAdded} missing column(s) to existing tables`);
    } else {
      console.log(`\n✅ All required columns exist in existing tables`);
    }
    
    console.log(`\n🎉 Database migration completed successfully!`);
    console.log(`   Executed ${executedCount} statements`);
    if (totalColumnsAdded > 0) {
      console.log(`   Added ${totalColumnsAdded} missing column(s)`);
    }
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    if (error.sql) {
      console.error(`   SQL: ${error.sql.substring(0, 200)}`);
    }
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

runMigration();

