#!/usr/bin/env node

/**
 * Generate sitemap.xml file for static deployment
 * Run this script to create a sitemap.xml in the public directory
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://conbyt.com';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Static pages configuration
const staticPages = [
  { 
    url: '', 
    priority: '1.0', 
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  { 
    url: '/case-studies', 
    priority: '0.9', 
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  { 
    url: '/blog', 
    priority: '0.9', 
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0]
  },
  { 
    url: '/privacy-policy', 
    priority: '0.3', 
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  { 
    url: '/terms-of-service', 
    priority: '0.3', 
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// NOTE: This script generates a static sitemap for initial deployment
// The actual production site uses dynamic sitemap generation from the Node.js server
// which includes CMS-generated blog posts from the database
const sampleBlogPosts = [
  { slug: 'future-of-ai-business-2024', lastmod: '2024-03-15' },
  { slug: 'machine-learning-vs-deep-learning', lastmod: '2024-03-10' },
  { slug: 'nlp-customer-service', lastmod: '2024-03-05' },
  { slug: 'computer-vision-applications', lastmod: '2024-02-28' }
];

const sampleCaseStudies = [
  { slug: 'hiresense', lastmod: '2024-01-15' },
  { slug: 'trykicks', lastmod: '2024-01-10' },
  { slug: 'flowagent', lastmod: '2024-01-05' },
  { slug: 'vocalis-ai', lastmod: '2024-01-01' },
  { slug: 'rizzko-tech-store', lastmod: '2023-12-25' },
  { slug: 'neuroresume', lastmod: '2023-12-20' }
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add blog posts
  sampleBlogPosts.forEach(post => {
    sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add case studies
  sampleCaseStudies.forEach(study => {
    sitemap += `
  <url>
    <loc>${BASE_URL}/case-study/${study.slug}</loc>
    <lastmod>${study.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function main() {
  try {
    console.log('🚀 Generating sitemap.xml...');
    
    // Create public directory if it doesn't exist
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generate and write sitemap
    const sitemapContent = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8');
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📁 Location: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${staticPages.length + sampleBlogPosts.length + sampleCaseStudies.length}`);
    
    // Also log the URL count breakdown
    console.log('\n📈 URL Breakdown:');
    console.log(`   • Static pages: ${staticPages.length}`);
    console.log(`   • Blog posts: ${sampleBlogPosts.length}`);
    console.log(`   • Case studies: ${sampleCaseStudies.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateSitemap };
