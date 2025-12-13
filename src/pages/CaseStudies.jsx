import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCaseStudies } from "../utils/api";
import SEOHead from "../components/SEO/SEOHead";

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
      const studies = await fetchCaseStudies(); // Assuming this fetches from CMS
      setCaseStudies(studies);
    } catch (err) {
      console.error('Error loading case studies:', err);
      setError('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

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
        <p className="text-xl text-red-500">{error || 'No case studies found.'}</p>
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
      <h1 className="text-4xl font-bold mb-6">Our Case Studies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caseStudies.map((study) => (
          <Link to={`/portfolio/${study.slug}`} key={study.slug} className="block bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={getImageUrl(study.image)} alt={study.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{study.title}</h2>
              <p className="text-white/70 text-sm mb-4">{study.excerpt}</p>
              <span className="text-accent hover:underline">Read More</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CaseStudies;