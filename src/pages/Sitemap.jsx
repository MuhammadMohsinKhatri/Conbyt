import { useEffect, useState } from 'react';
import { generateSitemap } from '../utils/sitemap';

const Sitemap = () => {
  const [sitemap, setSitemap] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        setSitemap(sitemapContent);
        
        // Set the content type to XML
        document.querySelector('head').insertAdjacentHTML('beforeend', 
          '<meta http-equiv="Content-Type" content="application/xml; charset=utf-8" />'
        );
      } catch (error) {
        console.error('Error loading sitemap:', error);
        setSitemap('Error generating sitemap');
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return <div>Generating sitemap...</div>;
  }

  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      overflow: 'auto'
    }}>
      {sitemap}
    </pre>
  );
};

export default Sitemap;
