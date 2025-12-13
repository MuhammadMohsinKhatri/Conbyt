import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  const fullTitle = title.includes('Conbyt') ? title : `${title} | Conbyt`;
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Conbyt" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@conbyt" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Conbyt" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
