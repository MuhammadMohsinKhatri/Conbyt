import { FaCircle } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../utils/api";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for elements that need entrance animations
  const titleRef = useRef(null);
  const timelineRef = useRef(null);
  const blogGridRef = useRef(null);
  const ctaRef = useRef(null);

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

  // Fetch blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await fetchBlogs();
        // Transform blog data to match component format and limit to 4 blogs
        const transformedBlogs = blogPosts.slice(0, 4).map(post => ({
          title: post.title,
          image: getImageUrl(post.image_url),
          link: `/blog/${post.slug}`,
          author: {
            name: post.author_name || 'Admin',
            avatar: post.author_avatar || 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          date: post.date || new Date().toISOString().split('T')[0],
          readTime: post.read_time || 5,
        }));
        setBlogs(transformedBlogs);
      } catch (err) {
        console.error('Error loading blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all elements
    [titleRef.current, timelineRef.current, blogGridRef.current, ctaRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const rows = [];
  for (let i = 0; i < blogs.length; i += 2) {
    rows.push([blogs[i], blogs[i + 1]]);
  }

  return (
    <section className="py-20" id="blogs">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Title with colored dots */}
        <div 
          ref={titleRef}
          className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          {/* Small uppercase text above main heading */}
          <span className="uppercase tracking-widest text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-accent/80 mb-2 sm:mb-4 text-center w-full block">
          Conbyt Chronicles
          </span>
          
          {/* Main heading with colored dots */}
          <div className="flex items-center justify-center gap-1 mb-6">
            <FaCircle className="text-accent text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent3 text-[8px] md:text-xs" aria-label="Accent dot" />
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mx-4 text-white tracking-tight">
              Latest Ideas & AI Insights
            </h2>
            <FaCircle className="text-accent3 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent text-[8px] md:text-xs" aria-label="Accent dot" />
          </div>
          
          {/* Description text below main heading */}
          <p className="text-center text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
            Explore thought leadership, practical guides, and trend analysis from our team designed to keep you ahead in the evolving world of AI and automation.
          </p>
        </div>
        
        <div className="relative">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-white/70">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/70">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Vertical center timeline line with dots */}
              <div 
                ref={timelineRef}
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-surface/60 z-0 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200" 
                style={{ transform: "translateX(-50%)" }}
              >
                {/* Dot 1: Top of upper two blogs center */}
                <div className="absolute w-4 h-4 bg-accent rounded-full border-2 border-white" style={{ 
                  left: '50%', 
                  top: '7%', 
                  transform: 'translate(-50%, -50%)' 
                }} />
                {/* Dot 2: Bottom of upper two blogs center */}
                <div className="absolute w-4 h-4 bg-accent rounded-full border-2 border-white" style={{ 
                  left: '50%', 
                  top: '39%', 
                  transform: 'translate(-50%, -50%)' 
                }} />
                {/* Dot 3: Top of lower two blogs center */}
                <div className="absolute w-4 h-4 bg-accent rounded-full border-2 border-white" style={{ 
                  left: '50%', 
                  top: '61%', 
                  transform: 'translate(-50%, -50%)' 
                }} />
                {/* Dot 4: Bottom of lower two blogs center */}
                <div className="absolute w-4 h-4 bg-accent rounded-full border-2 border-white" style={{ 
                  left: '50%', 
                  top: '93%', 
                  transform: 'translate(-50%, -50%)' 
                }} />
              </div>
              <div 
                ref={blogGridRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
              >
                {rows.map((pair, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {/* Left Card */}
                {pair[0] && (
                  <div className="relative flex flex-col items-end">
                    <div className="relative bg-surface rounded-2xl overflow-hidden shadow-lg group w-full aspect-square max-w-[32rem] mx-auto">
                      <img
                        src={pair[0].image}
                        alt={pair[0].title}
                        className="w-full h-full object-cover min-h-[24rem] min-w-[24rem]"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{pair[0].title}</h3>
                        <Link
                          to={pair[0].link}
                          className="mt-2 text-white text-lg md:text-xl font-semibold underline-offset-4 decoration-accent transition-colors duration-200 hover:text-accent hover:decoration-accent2 flex items-center gap-1 group/readmore"
                        >
                          Read More
                          <span className="text-xl group-hover/readmore:translate-x-1 transition-transform">&gt;</span>
                        </Link>
                        <div className="flex items-center gap-3 mt-6">
                          <img src={pair[0].author.avatar} alt={pair[0].author.name} className="w-9 h-9 rounded-full object-cover border-2 border-accent" />
                          <div className="flex flex-col text-white/80 text-xs">
                            <span className="font-semibold text-white">{pair[0].author.name}</span>
                            <span>{new Date(pair[0].date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {pair[0].readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Only show connector for odd rows (right side) */}
                    {rowIdx % 2 === 0 && (
                      <div className="hidden md:flex items-center absolute right-[-2.5rem] top-[15%] transform -translate-y-1/2 z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <polygon points="24,12 0,0 0,24" fill="#23232b" />
                        </svg>
                      </div>
                    )}
                    {/* Triangle for blog position (1,0) - left card in second row */}
                    {rowIdx === 1 && (
                      <div className="hidden md:flex items-center absolute right-[-2.5rem] top-[15%] transform -translate-y-1/2 z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <polygon points="24,12 0,0 0,24" fill="#23232b" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                {/* Right Card */}
                {pair[1] && (
                  <div className="relative flex flex-col items-start">
                    <div className="relative bg-surface rounded-2xl overflow-hidden shadow-lg group w-full aspect-square max-w-[32rem] mx-auto">
                      <img
                        src={pair[1].image}
                        alt={pair[1].title}
                        className="w-full h-full object-cover min-h-[24rem] min-w-[24rem]"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{pair[1].title}</h3>
                        <Link
                          to={pair[1].link}
                          className="mt-2 text-white text-lg md:text-xl font-semibold underline-offset-4 decoration-accent transition-colors duration-200 hover:text-accent hover:decoration-accent2 flex items-center gap-1 group/readmore"
                        >
                          Read More
                          <span className="text-xl group-hover/readmore:translate-x-1 transition-transform">&gt;</span>
                        </Link>
                        <div className="flex items-center gap-3 mt-6">
                          <img src={pair[1].author.avatar} alt={pair[1].author.name} className="w-9 h-9 rounded-full object-cover border-2 border-accent" />
                          <div className="flex flex-col text-white/80 text-xs">
                            <span className="font-semibold text-white">{pair[1].author.name}</span>
                            <span>{new Date(pair[1].date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {pair[1].readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Only show connector for even rows (left side) */}
                    {rowIdx % 2 === 1 && (
                      <div className="hidden md:flex items-center absolute left-[-2.5rem] top-[85%] transform -translate-y-1/2 z-10 flex-row-reverse">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <polygon points="0,12 24,0 24,24" fill="#23232b" />
                        </svg>
                      </div>
                    )}
                    {/* Triangle for blog position (0,1) - right card in first row */}
                    {rowIdx === 0 && (
                      <div className="hidden md:flex items-center absolute left-[-2.5rem] top-[85%] transform -translate-y-1/2 z-10 flex-row-reverse">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <polygon points="0,12 24,0 24,24" fill="#23232b" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div 
          ref={ctaRef}
          className="flex justify-center mt-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600"
        >
          <Link
            to="/blog"
            className="inline-block bg-gradient-to-r from-accent to-accent2 text-primary font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:from-accent2 hover:to-accent transition text-lg md:text-xl"
          >
            View All Blogs
          </Link>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;