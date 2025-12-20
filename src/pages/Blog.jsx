import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../utils/api";
import SEOHead from "../components/SEO/SEOHead";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogs();
  }, []);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads, return as is (will be served by server)
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    // Otherwise, assume it's a relative path and prepend /uploads
    return imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogs = await fetchBlogs();
      setBlogPosts(blogs);
    } catch (err) {
      console.error('Error loading blogs:', err);
      // Use the detailed error message from the API
      const errorMessage = err.message || 'Failed to load blog posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Conbyt AI Blog",
    "description": "Latest insights, trends, and developments in artificial intelligence and machine learning",
    "url": "https://conbyt.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Conbyt",
      "url": "https://conbyt.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://conbyt.com/assets/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://conbyt.com/blog"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://conbyt.com/blog/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author_name || "Conbyt Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Conbyt"
      },
      "image": post.image_url ? (post.image_url.startsWith('http') ? post.image_url : `https://conbyt.com${post.image_url}`) : "https://conbyt.com/assets/blog-default.jpg"
    }))
  };

  return (
    <>
      <SEOHead
        title="AI Blog | Latest Insights & Trends in Machine Learning"
        description="Stay updated with the latest developments in artificial intelligence, machine learning, and technology trends. Expert insights help you understand the future of AI and its impact on business."
        keywords="AI blog, machine learning blog, artificial intelligence trends, AI insights, ML developments, tech blog, AI news"
        canonical="https://conbyt.com/blog"
        ogImage="https://conbyt.com/assets/og-blog.jpg"
        structuredData={structuredData}
      />
      <div className="min-h-screen text-white">
      {/* Page Title Section */}
      <section className="w-full bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-white mb-2 font-sans">Blog</h1>
            <p className="text-white/80 font-medium">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link> / Blog
            </p>
          </div>
        </div>
      </section>
      <hr className="my-8 border-t border-surface/60 w-full" />
      
      {/* Introduction Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <span className="text-accent text-sm font-semibold uppercase tracking-wider">Insights & Knowledge</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 font-sans text-white">Latest AI Insights & Industry Trends</h2>
        <p className="text-white/80 text-lg leading-relaxed font-normal">
          Stay updated with the latest developments in artificial intelligence, machine learning, and technology trends. 
          Our expert insights help you understand the future of AI and its impact on business and society.
        </p>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-white/70">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={loadBlogs}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/70">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const formattedDate = post.date 
                ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : new Date().toLocaleDateString();
              const readTime = post.read_time ? `${post.read_time} min read` : '5 min read';
              const imageUrl = getImageUrl(post.image_url);
              
              return (
                <div key={post.id} className="bg-surface rounded-xl overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden bg-secondary/50">
                    <img 
                      src={imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  </div>
                  
                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-accent text-xs font-semibold uppercase tracking-wider">{post.category || 'Uncategorized'}</span>
                      <span className="text-white/60 text-xs">{readTime}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                    
                    {/* Excerpt */}
                    <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt || ''}</p>
                    
                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 text-xs">By {post.author_name || 'Admin'}</span>
                      <span className="text-white/60 text-xs">{formattedDate}</span>
                    </div>
                    
                    {/* Read More Button */}
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-accent hover:text-white transition-colors font-semibold text-sm"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-surface rounded-xl p-8 border border-accent/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated with AI Insights</h3>
          <p className="text-white/80 mb-6">Subscribe to our newsletter for the latest AI trends, case studies, and industry insights delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-accent/20 text-white placeholder-white/60 focus:outline-none focus:border-accent"
            />
            <button className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Blog;
