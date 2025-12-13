import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCaseStudies } from "../utils/api";
import SEOHead from "../components/SEO/SEOHead";
import portfolio1 from "../assets/portfolio/1.webp";

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      setError(null);
      const studies = await fetchCaseStudies(); // Fetches from CMS portfolios
      setCaseStudies(studies);
    } catch (err) {
      console.error('Error loading case studies:', err);
      setError('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return portfolio1;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading Case Studies...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudies.length) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
             <p className="text-xl text-red-500 mb-4">{error || 'No case studies found.'}</p>
             <button 
                onClick={loadCaseStudies}
                className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/80 transition"
             >
                Try Again
             </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <SEOHead 
        title="Case Studies | Conbyt"
        description="Explore Conbyt's successful AI and Machine Learning case studies."
        keywords="AI case studies, Machine Learning projects, Conbyt portfolio, success stories"
      />
      <h1 className="text-4xl font-bold mb-6 pt-20">Our Case Studies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caseStudies.map((cs, i) => {
            const imageUrl = cs.image_url || cs.image || portfolio1;
            
            // Handle tech stack
            let techArray = [];
            if (Array.isArray(cs.tech_stack)) {
              techArray = cs.tech_stack;
            } else if (typeof cs.tech_stack === 'string') {
              try {
                const parsed = JSON.parse(cs.tech_stack);
                if (Array.isArray(parsed)) techArray = parsed;
                else techArray = cs.tech_stack.split(',').map(t => t.trim());
              } catch (e) {
                techArray = cs.tech_stack.split(',').map(t => t.trim());
              }
            } else if (Array.isArray(cs.tech)) {
              techArray = cs.tech;
            } else {
              techArray = ['AI', 'ML'];
            }

            // Clean up description
            const stripHtml = (html) => {
               if (!html) return '';
               const tmp = document.createElement("DIV");
               tmp.innerHTML = html;
               return tmp.textContent || tmp.innerText || "";
            };
            
            const description = cs.description ? (cs.description.includes('<') ? stripHtml(cs.description) : cs.description) : (cs.excerpt || "No description available.");
            const truncatedDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;

            return (
            <div
              key={cs.id || i}
              className="bg-surface w-full rounded-2xl overflow-hidden flex flex-col items-center shadow-lg group hover:shadow-[0_0_30px_rgba(0,255,198,0.15)] transition-all duration-300 border border-white/5"
            >
              <div className="relative w-full group/image aspect-[4/3] overflow-hidden">
                <img
                  src={imageUrl}
                  alt={cs.title}
                  className="w-full h-full object-cover transition duration-500 group-hover/image:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = portfolio1; // Fallback image
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Link
                  to={`/portfolio/${cs.slug || cs.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  tabIndex={-1}
                >
                  <span className="bg-gradient-to-r from-accent to-accent2 text-primary font-bold px-5 py-2 rounded-full shadow-lg text-sm sm:text-base hover:scale-105 transition">
                    View details
                  </span>
                </Link>
              </div>
              
              <div className="w-full flex flex-col items-start justify-end p-5 sm:p-6 flex-1">
                 <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-left w-full group-hover:text-accent transition-colors">
                   {cs.title}
                 </h3>
                 <div className="flex items-center mb-3 w-full">
                   <div
                     className="h-0.5 bg-white/60"
                     style={{
                       width: "100px",
                       maxWidth: "100%",
                       flex: `0 0 ${cs.title.length}ch`,
                     }}
                   />
                   <div className="w-2 h-2 bg-accent rounded-full ml-2"></div>
                 </div>
                 <p className="text-sm text-white/70 font-normal mb-4 text-left line-clamp-3 flex-1">
                   {truncatedDesc}
                 </p>
                <div className="flex gap-2 flex-wrap mt-auto">
                  {techArray.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20"
                    >
                      {t}
                    </span>
                  ))}
                  {techArray.length > 4 && (
                    <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20">
                      +{techArray.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
        })}
      </div>
    </div>
  );
};

export default CaseStudies;
