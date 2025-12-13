import React from 'react';

// Temporary fallback component if react-helmet-async isn't available
const SEOHead = ({
  title = "Conbyt - AI & Machine Learning Solutions",
  description = "Transform your business with cutting-edge AI and machine learning solutions. Custom AI development, data analytics, and automation services.",
  keywords = "AI development, machine learning, artificial intelligence, data analytics, automation, custom AI solutions",
  canonical = "https://conbyt.com",
  ogTitle,
  ogDescription,
  ogImage = "https://conbyt.com/assets/og-default.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData = null,
  noIndex = false
}) => {
  // Use useEffect to set document title and meta tags manually
  React.useEffect(() => {
    const fullTitle = title.includes('Conbyt') ? title : `${title} | Conbyt`;
    document.title = fullTitle;
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Set canonical URL
    let canonical_link = document.querySelector('link[rel="canonical"]');
    if (!canonical_link) {
      canonical_link = document.createElement('link');
      canonical_link.rel = 'canonical';
      document.head.appendChild(canonical_link);
    }
    canonical_link.href = canonical;
    
    // Add structured data if provided
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, canonical, structuredData]);

  return null; // This component doesn't render anything
};

export default SEOHead;