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
        const studyData = await fetchCaseStudyBySlug(slug); // Assuming this fetches from CMS
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.excerpt,
    "image": getImageUrl(caseStudy.image),
    "author": {
      "@type": "Person",
      "name": caseStudy.author || "Conbyt Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Conbyt",
      "logo": {
        "@type": "ImageObject",
        "url": "https://conbyt.com/logo.png"
      }
    },
    "datePublished": caseStudy.datePublished || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://conbyt.com/portfolio/${caseStudy.slug}`
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <SEOHead 
        title={caseStudy.seoTitle || caseStudy.title}
        description={caseStudy.seoDescription || caseStudy.excerpt}
        keywords={caseStudy.seoKeywords || caseStudy.tags?.join(', ') || 'case study, AI, Machine Learning'}
        structuredData={structuredData}
      />
      
      <h1 className="text-4xl font-bold mb-6">{caseStudy.title}</h1>
      <img src={getImageUrl(caseStudy.image)} alt={caseStudy.title} className="w-full h-96 object-cover rounded-lg mb-8" />
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: caseStudy.body }} />

      {caseStudy.relatedPosts && caseStudy.relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Related Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudy.relatedPosts.map((post) => (
              <Link to={`/portfolio/${post.slug}`} key={post.slug} className="block bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{post.excerpt}</p>
                  <span className="text-accent hover:underline">Read More</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyDetail; 