import { fetchBlogs, fetchCaseStudies } from './api';

// Generate sitemap XML
export const generateSitemap = async () => {
  const baseUrl = 'https://conbyt.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/case-studies', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/terms-of-service', priority: '0.3', changefreq: 'monthly' }
  ];

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  try {
    // Add blog posts
    const blogs = await fetchBlogs();
    blogs.forEach(blog => {
      const blogDate = blog.date ? new Date(blog.date).toISOString().split('T')[0] : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blogDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  } catch (error) {
    console.log('Could not fetch blogs for sitemap:', error.message);
  }

  try {
    // Add case studies
    const caseStudies = await fetchCaseStudies();
    caseStudies.forEach(study => {
      const studyDate = study.date ? new Date(study.date).toISOString().split('T')[0] : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/case-study/${study.slug || study.id}</loc>
    <lastmod>${studyDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
  } catch (error) {
    console.log('Could not fetch case studies for sitemap:', error.message);
  }

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow CMS/admin pages
Disallow: /cms/

# Sitemap
Sitemap: https://conbyt.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
};

// Save sitemap to public directory (for development)
export const saveSitemap = async () => {
  try {
    const sitemapContent = await generateSitemap();
    // In a real application, you'd save this to public/sitemap.xml
    // For now, we'll just return the content
    return sitemapContent;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};
