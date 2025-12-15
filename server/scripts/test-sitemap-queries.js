import pool from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function testSitemapQueries() {
  try {
    console.log('🔍 Testing sitemap database queries...\n');
    
    // Test blog posts query
    console.log('📝 Testing Blog Posts Query:');
    const [blogRows] = await pool.execute(`
      SELECT slug, updated_at, created_at, published, is_published
      FROM blog_posts 
      WHERE (published = true OR published = 1) 
      OR (is_published = true OR is_published = 1)
    `);
    
    console.log(`Found ${blogRows.length} blog posts:`);
    blogRows.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.slug} - published: ${blog.published}, is_published: ${blog.is_published}`);
    });
    
    // Test case studies query
    console.log('\n📁 Testing Case Studies Query:');
    const [caseStudyRows] = await pool.execute(`
      SELECT slug, updated_at, created_at, is_published
      FROM case_studies 
      WHERE is_published = true OR is_published = 1
    `);
    
    console.log(`Found ${caseStudyRows.length} case studies:`);
    caseStudyRows.forEach((study, index) => {
      console.log(`${index + 1}. ${study.slug} - is_published: ${study.is_published}`);
    });
    
    // Test what would be in sitemap
    console.log('\n🌐 Sitemap URLs that should be generated:');
    console.log('Static pages: 8 URLs');
    console.log(`Blog posts: ${blogRows.length} URLs`);
    console.log(`Case studies: ${caseStudyRows.length} URLs`);
    console.log(`Total: ${8 + blogRows.length + caseStudyRows.length} URLs`);
    
    if (blogRows.length > 0) {
      console.log('\nBlog URLs:');
      blogRows.forEach(blog => {
        console.log(`- https://conbyt.com/blog/${blog.slug}`);
      });
    }
    
    if (caseStudyRows.length > 0) {
      console.log('\nCase Study URLs:');
      caseStudyRows.forEach(study => {
        console.log(`- https://conbyt.com/case-study/${study.slug}`);
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error testing queries:', error.message);
    await pool.end();
  }
}

testSitemapQueries();
