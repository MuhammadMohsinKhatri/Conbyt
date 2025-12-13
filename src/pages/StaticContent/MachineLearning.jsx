import React, { useEffect, useState } from 'react';
import { fetchPageContent } from '../../utils/api';
import SEOHead from '../../components/SEO/SEOHead';

const MachineLearning = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const pageContent = await fetchPageContent('machine-learning'); // 'machine-learning' is the slug for this page
        setContent(pageContent);
      } catch (err) {
        console.error('Error loading Machine Learning page content:', err);
        setError('Failed to load Machine Learning content');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading Machine Learning...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error || 'Machine Learning content not found.'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <SEOHead 
        title={content.seoTitle || 'Machine Learning | Conbyt'}
        description={content.seoDescription || "Discover Conbyt's expertise in Machine Learning development and implementation."}
        keywords={content.seoKeywords || 'Machine Learning, ML development, predictive analytics, deep learning'}
      />
      <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
  );
};

export default MachineLearning;
