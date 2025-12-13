import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCaseStudyBySlug } from "../utils/api";
import SEOHead from "../components/SEO/SEOHead";

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        setLoading(true);
        setError(null);
        const studyData = await fetchCaseStudyBySlug(slug); // Fetches from CMS portfolios
        setCaseStudy(studyData);
      } catch (err) {
        console.error('Error loading case study:', err);
        setError('Failed to load case study');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCaseStudy();
    }
  }, [slug]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
  };

  // Helper to parse tech stack
  const getTechStack = (stack) => {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;
    if (typeof stack === 'string') {
      try {
        const parsed = JSON.parse(stack);
        return Array.isArray(parsed) ? parsed : stack.split(',').map(t => t.trim());
      } catch (e) {
        return stack.split(',').map(t => t.trim());
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error || 'Case study not found.'}</p>
      </div>
    );
  }

  // Clean description for SEO description
  const stripHtml = (html) => {
     if (!html) return '';
     const tmp = document.createElement("DIV");
     tmp.innerHTML = html;
     return tmp.textContent || tmp.innerText || "";
  };
  
  const seoDescription = caseStudy.seoDescription || (caseStudy.description ? stripHtml(caseStudy.description).substring(0, 160) : 'Case Study Detail');
  const techStack = getTechStack(caseStudy.tech_stack);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": seoDescription,
    "image": getImageUrl(caseStudy.image_url),
    "author": {
      "@type": "Person",
      "name": "Conbyt Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Conbyt",
      "logo": {
        "@type": "ImageObject",
        "url": "https://conbyt.com/assets/newlogo14.png"
      }
    },
    "datePublished": caseStudy.created_at || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://conbyt.com/portfolio/${caseStudy.slug}`
    }
  };

  return (
    <div className="container mx-auto p-4 text-white pt-24 sm:pt-28 md:pt-32">
      <SEOHead 
        title={`${caseStudy.title} | Conbyt Case Studies`}
        description={seoDescription}
        keywords={techStack.join(', ') || 'case study, AI, Machine Learning, portfolio'}
        structuredData={structuredData}
      />
      
      <div className="max-w-4xl mx-auto">
        <Link to="/case-studies" className="inline-block mb-6 text-accent hover:underline">
          &larr; Back to Case Studies
        </Link>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">{caseStudy.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {techStack.map((tech, idx) => (
            <span key={idx} className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm">
              {tech}
            </span>
          ))}
        </div>

        <img 
          src={getImageUrl(caseStudy.image_url || caseStudy.image)} 
          alt={caseStudy.title} 
          className="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-2xl mb-8 border border-white/10" 
        />
        
        <div className="flex gap-4 mb-8">
          {caseStudy.live_url && (
            <a 
              href={caseStudy.live_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-accent text-primary font-bold rounded-full hover:bg-accent2 transition"
            >
              Live Demo
            </a>
          )}
          {caseStudy.github_url && (
            <a 
              href={caseStudy.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-secondary border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition"
            >
              GitHub Repo
            </a>
          )}
        </div>

        <div className="prose prose-invert prose-lg max-w-none bg-surface p-6 sm:p-8 rounded-xl border border-white/5 shadow-xl" dangerouslySetInnerHTML={{ __html: caseStudy.description }} />
      </div>
    </div>
  );
};

export default CaseStudyDetail;
