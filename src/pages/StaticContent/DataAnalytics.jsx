import React, { useEffect, useState } from 'react';
import { fetchPageContent } from '../../utils/api';
import SEOHead from '../../components/SEO/SEOHead';

const DataAnalytics = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const pageContent = await fetchPageContent('data-analytics'); // 'data-analytics' is the slug for this page
        setContent(pageContent);
      } catch (err) {
        console.error('Error loading Data Analytics page content:', err);
        setError('Failed to load Data Analytics content');
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
          <p className="text-white/70">Loading Data Analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error || 'Data Analytics content not found.'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <SEOHead 
        title={content.seoTitle || 'Data Analytics | Conbyt'}
        description={content.seoDescription || "Unlock insights with Conbyt's Data Analytics services."}
        keywords={content.seoKeywords || 'Data Analytics, big data, business intelligence, data visualization'}
      />
      <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
  );
};

export default DataAnalytics;
