#!/usr/bin/env node

/**
 * Check database data for sitemap generation
 * This script helps debug why CMS blog posts aren't appearing in the sitemap
 */

import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkSitemapData() {
  try {
    console.log('🔍 Checking database connection and sitemap data...\n');

    // Test database connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();

    // Check blog posts
    console.log('\n📝 Checking blog posts:');
    const [blogRows] = await pool.execute('SELECT id, title, slug, published, created_at, updated_at FROM blog_posts ORDER BY created_at DESC');
    
    console.log(`Total blog posts in database: ${blogRows.length}`);
    
    if (blogRows.length > 0) {
      console.log('\nAll blog posts:');
      blogRows.forEach((blog, index) => {
        const status = blog.published ? '✅ Published' : '❌ Unpublished';
        console.log(`${index + 1}. ${blog.title} (${blog.slug}) - ${status}`);
        console.log(`   Created: ${blog.created_at}, Updated: ${blog.updated_at}`);
      });

      // Check published blog posts specifically
      const [publishedBlogs] = await pool.execute('SELECT id, title, slug, created_at, updated_at FROM blog_posts WHERE published = true ORDER BY created_at DESC');
      console.log(`\n🌐 Published blog posts (will appear in sitemap): ${publishedBlogs.length}`);
      
      if (publishedBlogs.length > 0) {
        publishedBlogs.forEach((blog, index) => {
          console.log(`${index + 1}. ${blog.title} (${blog.slug})`);
          console.log(`   URL: https://conbyt.com/blog/${blog.slug}`);
        });
      } else {
        console.log('⚠️  No published blog posts found! This is why they don\'t appear in the sitemap.');
        console.log('💡 To fix: Go to CMS Dashboard and set published = true for blog posts you want in the sitemap.');
      }
    } else {
      console.log('⚠️  No blog posts found in database!');
      console.log('💡 To fix: Create blog posts using the CMS Dashboard.');
    }

    // Check case studies
    console.log('\n📁 Checking case studies:');
    const [caseStudyRows] = await pool.execute('SELECT id, title, slug, created_at, updated_at FROM case_studies ORDER BY created_at DESC');
    
    console.log(`Total case studies in database: ${caseStudyRows.length}`);
    
    if (caseStudyRows.length > 0) {
      console.log('\nCase studies (all appear in sitemap):');
      caseStudyRows.forEach((caseStudy, index) => {
        console.log(`${index + 1}. ${caseStudy.title} (${caseStudy.slug})`);
        console.log(`   URL: https://conbyt.com/case-study/${caseStudy.slug}`);
      });
    }

    console.log('\n🎯 Summary:');
    console.log(`- Blog posts in sitemap: ${publishedBlogs.length}`);
    console.log(`- Case studies in sitemap: ${caseStudyRows.length}`);
    console.log(`- Total dynamic URLs: ${publishedBlogs.length + caseStudyRows.length}`);

    if (publishedBlogs.length === 0) {
      console.log('\n❌ ISSUE FOUND: No published blog posts!');
      console.log('🔧 SOLUTION: ');
      console.log('   1. Go to your CMS Dashboard');
      console.log('   2. Edit existing blog posts');
      console.log('   3. Check the "Published" checkbox');
      console.log('   4. Save the posts');
      console.log('   5. Check sitemap.xml again');
    }

  } catch (error) {
    console.error('❌ Error checking sitemap data:', error.message);
    console.error('💡 Make sure:');
    console.error('   1. Database connection is configured correctly');
    console.error('   2. .env file exists with correct DB credentials');
    console.error('   3. Database tables exist (run migration if needed)');
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkSitemapData();
}

export default checkSitemapData;
