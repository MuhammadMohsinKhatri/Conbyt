import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import blog1 from "../assets/blogs/blog1.webp";
import blog2 from "../assets/blogs/blog2.webp";
import blog3 from "../assets/blogs/blog3.webp";
import blog4 from "../assets/blogs/blog4.webp";
import blog5 from "../assets/blogs/blog5.webp";
import blog6 from "../assets/blogs/blog6.webp";


const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Business: 2024 Trends and Predictions",
    excerpt: "Explore the latest developments in artificial intelligence and how they're reshaping business operations across industries.",
    image: blog1,
    category: "AI Trends",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "8 min read",
    slug: "future-of-ai-business-2024"
  },
  {
    id: 2,
    title: "Machine Learning vs Deep Learning: Understanding the Differences",
    excerpt: "A comprehensive guide to understanding the key differences between machine learning and deep learning approaches.",
    image: blog2,
    category: "Machine Learning",
    author: "Michael Chen",
    date: "March 10, 2024",
    readTime: "12 min read",
    slug: "machine-learning-vs-deep-learning"
  },
  {
    id: 3,
    title: "Building Scalable AI Solutions: Best Practices for Enterprise",
    excerpt: "Learn the essential strategies and best practices for developing scalable AI solutions in enterprise environments.",
    image: blog3,
    category: "Enterprise AI",
    author: "David Rodriguez",
    date: "March 5, 2024",
    readTime: "15 min read",
    slug: "building-scalable-ai-solutions"
  },
  {
    id: 4,
    title: "Natural Language Processing: Revolutionizing Customer Service",
    excerpt: "Discover how NLP is transforming customer service and creating more intelligent, responsive support systems.",
    image: blog4,
    category: "NLP",
    author: "Emily Watson",
    date: "February 28, 2024",
    readTime: "10 min read",
    slug: "nlp-revolutionizing-customer-service"
  },
  {
    id: 5,
    title: "Computer Vision Applications in Modern Industries",
    excerpt: "Explore real-world applications of computer vision technology across various industries and sectors.",
    image: blog5,
    category: "Computer Vision",
    author: "Alex Thompson",
    date: "February 20, 2024",
    readTime: "14 min read",
    slug: "computer-vision-applications-industries"
  },
  {
    id: 6,
    title: "The Rise of Conversational AI: Chatbots and Beyond",
    excerpt: "Understanding the evolution of conversational AI and its impact on user experience and business automation.",
    image: blog6,
    category: "Conversational AI",
    author: "Lisa Park",
    date: "February 15, 2024",
    readTime: "11 min read",
    slug: "rise-of-conversational-ai"
  }
];

const Blog = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-surface rounded-xl overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Blog Content */}
              <div className="p-6">
                {/* Category and Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider">{post.category}</span>
                  <span className="text-white/60 text-xs">{post.readTime}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                
                {/* Excerpt */}
                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                
                {/* Author and Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-xs">By {post.author}</span>
                  <span className="text-white/60 text-xs">{post.date}</span>
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
          ))}
        </div>
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
  );
};

export default Blog;
