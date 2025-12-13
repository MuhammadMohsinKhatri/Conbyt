import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchCaseStudies } from "../utils/api";
import portfolio1 from "../assets/portfolio/1.webp";
import portfolio2 from "../assets/portfolio/2.webp";
import portfolio3 from "../assets/portfolio/3.webp";
import portfolio4 from "../assets/portfolio/4.webp";
import portfolio5 from "../assets/portfolio/5.webp";
import portfolio6 from "../assets/portfolio/6.webp";

// Fallback data in case API is not available
const fallbackCaseStudies = [
  {
    id: 1,
    title: "HireSense",
    description: "A platform that streamlines technical hiring with AI-powered interviews, automated evaluations, and insightful candidate analytics.",
    image: portfolio1,
    tech: ["React", "Python", "AI"],
    category: "AI Automation",
    slug: "hiresense"
  },
  {
    id: 2,
    title: "TryKicks",
    description: "A shoe shopping app with virtual try-on functionality.",
    image: portfolio2,
    tech: ["Python", "ML", "Dashboard"],
    category: "Machine Learning",
    slug: "trykicks"
  },
  {
    id: 3,
    title: "FlowAgent",
    description: "A platform where users can create custom AI agents, assistants, and workflows to automate their tasks effortlessly.",
    image: portfolio3,
    tech: ["NLP", "Healthcare", "AI"],
    category: "AI Automation",
    slug: "flowagent"
  },
  {
    id: 4,
    title: "Vocalis AI",
    description: "A platform to create AI voice agents, automate calls, boost sales, and leverage text-to-speech technology.",
    image: portfolio4,
    tech: ["React", "Python", "AI"],
    category: "Speech Recognition",
    slug: "vocalis-ai"
  },
  {
    id: 5,
    title: "Rizzko Tech Store",
    description: "An e-commerce platform with advanced product recommendations and AI-powered search functionality.",
    image: portfolio5,
    tech: ["React", "ML", "AI"],
    category: "Machine Learning",
    slug: "rizzko-tech-store"
  },
  {
    id: 6,
    title: "NeuroResume",
    description: "AI-powered resume builder with intelligent content suggestions and optimization.",
    image: portfolio6,
    tech: ["NLP", "AI", "React"],
    category: "NLP",
    slug: "neuroresume"
  }
];

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState(fallbackCaseStudies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts and load dynamic data
  useEffect(() => {
    window.scrollTo(0, 0);
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      setError(null);
      const dynamicCaseStudies = await fetchCaseStudies();
      setCaseStudies(dynamicCaseStudies);
    } catch (err) {
      console.error('Error loading case studies:', err);
      setError('Failed to load case studies, showing fallback data');
      // Keep fallback data if API fails
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return portfolio1; // Default fallback
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads, return as is (will be served by server)
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    // If it's imported asset, return as is
    if (typeof imagePath === 'string' && !imagePath.startsWith('/')) {
      return imagePath;
    }
    // Otherwise, assume it's a relative path and prepend /uploads
    return imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
  };

  return (
    <>
      <Helmet>
        <title>Case Studies | AI & Machine Learning Projects | Conbyt</title>
        <meta name="description" content="Explore our portfolio of successful AI and machine learning projects. See how we've transformed businesses with cutting-edge technology solutions and delivered measurable ROI." />
        <meta name="keywords" content="AI case studies, machine learning projects, AI portfolio, business transformation, AI solutions, ML success stories" />
        <link rel="canonical" href="https://conbyt.com/case-studies" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Case Studies | AI & Machine Learning Projects | Conbyt" />
        <meta property="og:description" content="Explore our portfolio of successful AI and machine learning projects. See how we've transformed businesses with cutting-edge technology solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conbyt.com/case-studies" />
        <meta property="og:image" content="https://conbyt.com/assets/og-case-studies.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Studies | AI & Machine Learning Projects | Conbyt" />
        <meta name="twitter:description" content="Explore our portfolio of successful AI and machine learning projects." />
        <meta name="twitter:image" content="https://conbyt.com/assets/og-case-studies.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Case Studies",
            "description": "Portfolio of AI and machine learning projects delivered by Conbyt",
            "url": "https://conbyt.com/case-studies",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": caseStudies.map((study, index) => ({
                "@type": "CreativeWork",
                "position": index + 1,
                "name": study.title,
                "description": study.description,
                "url": `https://conbyt.com/case-study/${study.slug}`,
                "keywords": study.tech?.join(', ') || study.category
              }))
            },
            "provider": {
              "@type": "Organization",
              "name": "Conbyt",
              "url": "https://conbyt.com"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen text-white">
      {/* Page Title Section */}
      <section className="w-full bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-white mb-2 font-sans">Case Studies</h1>
            <p className="text-white/80 font-medium">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link> / CaseStudies
            </p>
          </div>
        </div>
      </section>
      <hr className="my-8 border-t border-surface/60 w-full" />
      {/* Introduction Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <span className="text-accent text-sm font-semibold uppercase tracking-wider">Case Studies</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 font-sans text-white">Transformations We've Delivered</h2>
        <p className="text-white/80 text-lg leading-relaxed font-normal">
          We specialize in cutting-edge AI and machine learning solutions that drive real business results. 
          Our portfolio showcases innovative projects that have transformed operations, increased efficiency, 
          and delivered measurable ROI for our clients across various industries.
        </p>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-white/70">Loading case studies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 mb-8">
            <p className="text-yellow-400 text-sm">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => {
            const imageUrl = getImageUrl(study.image_url || study.image);
            const techArray = Array.isArray(study.tech) ? study.tech 
                             : study.technologies ? study.technologies.split(',').map(t => t.trim())
                             : study.tech_stack ? study.tech_stack.split(',').map(t => t.trim())
                             : ['AI', 'ML']; // Default fallback
            
            return (
              <div key={study.id} className="bg-surface rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
                <div className="mb-4">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                    {study.category || study.project_type || 'AI Project'}
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-1 font-sans text-white">{study.title}</h3>
                  <p className="text-sm text-white/70 font-normal">
                    {study.description || study.short_description || study.excerpt}
                  </p>
                </div>
                
                <div className="mb-4">
                  <img
                    src={imageUrl}
                    alt={study.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = portfolio1; // Fallback image
                    }}
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap mb-6">
                  {techArray.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <Link 
                  to={`/case-study/${study.slug || study.id}`}
                  className="w-full bg-gradient-to-r from-accent to-accent2 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold font-sans inline-block text-center"
                >
                  View Project
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;