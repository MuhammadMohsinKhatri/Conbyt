import pool from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...\n');
    
    // Check case_studies table
    console.log('📋 Case Studies Table Structure:');
    const [caseStudyRows] = await pool.execute('DESCRIBE case_studies');
    caseStudyRows.forEach(row => {
      console.log(`- ${row.Field} (${row.Type}) - ${row.Null === 'YES' ? 'Optional' : 'Required'}`);
    });
    
    console.log('\n📝 Blog Posts Table Structure:');
    const [blogRows] = await pool.execute('DESCRIBE blog_posts');
    blogRows.forEach(row => {
      console.log(`- ${row.Field} (${row.Type}) - ${row.Null === 'YES' ? 'Optional' : 'Required'}`);
    });
    
    // Check actual data
    console.log('\n📊 Current Data:');
    const [caseCount] = await pool.execute('SELECT COUNT(*) as count FROM case_studies');
    const [blogCount] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    const [publishedBlogCount] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts WHERE published = true');
    
    console.log(`- Case Studies: ${caseCount[0].count}`);
    console.log(`- Blog Posts: ${blogCount[0].count}`);
    console.log(`- Published Blog Posts: ${publishedBlogCount[0].count}`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
  }
}

checkSchema();
