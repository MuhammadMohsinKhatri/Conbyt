/**
 * SEO Analysis Utility Functions
 * Provides comprehensive SEO analysis similar to premium WordPress plugins
 */

export const analyzeTitle = (title, focusKeyword = '') => {
  const length = title?.length || 0;
  const hasKeyword = focusKeyword && title?.toLowerCase().includes(focusKeyword.toLowerCase());
  
  return {
    length,
    isValid: length >= 30 && length <= 60,
    hasKeyword,
    score: length >= 30 && length <= 60 ? (hasKeyword ? 100 : 80) : 0,
    recommendation: length < 30
      ? 'Title is too short. Aim for 30-60 characters.'
      : length > 60
      ? 'Title is too long. Keep it under 60 characters.'
      : hasKeyword
      ? 'Perfect! Title includes focus keyword.'
      : 'Consider adding focus keyword to title.'
  };
};

export const analyzeMetaDescription = (description, focusKeyword = '') => {
  const length = description?.length || 0;
  const hasKeyword = focusKeyword && description?.toLowerCase().includes(focusKeyword.toLowerCase());
  
  return {
    length,
    isValid: length >= 120 && length <= 160,
    hasKeyword,
    score: length >= 120 && length <= 160 ? (hasKeyword ? 100 : 80) : 0,
    recommendation: length < 120
      ? 'Description is too short. Aim for 120-160 characters.'
      : length > 160
      ? 'Description is too long. Keep it under 160 characters.'
      : hasKeyword
      ? 'Perfect! Description includes focus keyword.'
      : 'Consider adding focus keyword to description.'
  };
};

export const analyzeKeywordDensity = (content, keyword) => {
  if (!keyword || !content) return { density: 0, isValid: false, recommendation: 'Add focus keyword and content.' };
  
  const text = content.replace(/<[^>]*>/g, '').toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(word => word === keywordLower).length;
  const density = (keywordCount / words.length) * 100;
  
  return {
    density: parseFloat(density.toFixed(2)),
    count: keywordCount,
    isValid: density >= 0.5 && density <= 2.5,
    score: density >= 0.5 && density <= 2.5 ? 100 : density < 0.5 ? 50 : 30,
    recommendation: density < 0.5
      ? `Keyword density is too low (${density.toFixed(2)}%). Aim for 0.5-2.5%.`
      : density > 2.5
      ? `Keyword density is too high (${density.toFixed(2)}%). Reduce to 0.5-2.5%.`
      : `Perfect keyword density (${density.toFixed(2)}%)!`
  };
};

export const analyzeContent = (content) => {
  const text = content?.replace(/<[^>]*>/g, '') || '';
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  const wordCount = words.length;
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  const avgWordsPerParagraph = paragraphs.length > 0 ? wordCount / paragraphs.length : 0;
  
  // Flesch Reading Ease Score (simplified)
  const avgWordsPerSentence = avgSentenceLength;
  const avgSyllablesPerWord = 1.5; // Simplified estimation
  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength: parseFloat(avgSentenceLength.toFixed(1)),
    avgWordsPerParagraph: parseFloat(avgWordsPerParagraph.toFixed(1)),
    readingTime: Math.ceil(wordCount / 200), // 200 words per minute
    fleschScore: parseFloat(fleschScore.toFixed(1)),
    isValid: wordCount >= 300,
    score: wordCount >= 300 ? (wordCount >= 1000 ? 100 : 80) : 40,
    recommendation: wordCount < 300
      ? 'Content is too short. Aim for at least 300 words for better SEO.'
      : wordCount >= 1000
      ? 'Excellent content length!'
      : 'Good content length. Consider expanding to 1000+ words for comprehensive coverage.'
  };
};

export const analyzeHeadings = (content) => {
  if (!content) return { h1Count: 0, h2Count: 0, h3Count: 0, isValid: false };
  
  const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
  
  return {
    h1Count,
    h2Count,
    h3Count,
    isValid: h1Count === 1 && h2Count >= 2,
    score: h1Count === 1 && h2Count >= 2 ? 100 : h1Count === 1 ? 70 : 30,
    recommendation: h1Count === 0
      ? 'Add one H1 heading for better structure.'
      : h1Count > 1
      ? 'Use only one H1 heading per page.'
      : h2Count < 2
      ? 'Add at least 2 H2 headings to organize your content.'
      : 'Perfect heading structure!'
  };
};

export const analyzeLinks = (content) => {
  if (!content) return { internal: 0, external: 0, isValid: false };
  
  const allLinks = content.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
  const internalLinks = allLinks.filter(link => {
    const href = link.match(/href=["']([^"']+)["']/i)?.[1] || '';
    return href.startsWith('/') || href.includes(window.location.hostname);
  });
  const externalLinks = allLinks.filter(link => {
    const href = link.match(/href=["']([^"']+)["']/i)?.[1] || '';
    return href.startsWith('http') && !href.includes(window.location.hostname);
  });
  
  return {
    total: allLinks.length,
    internal: internalLinks.length,
    external: externalLinks.length,
    isValid: internalLinks.length >= 2 && externalLinks.length >= 1,
    score: internalLinks.length >= 2 && externalLinks.length >= 1 ? 100 : internalLinks.length >= 2 ? 70 : 40,
    recommendation: internalLinks.length < 2
      ? 'Add at least 2 internal links to related content.'
      : externalLinks.length < 1
      ? 'Add at least 1 external link to authoritative sources.'
      : 'Great linking strategy!'
  };
};

export const analyzeImages = (content, focusKeyword = '') => {
  if (!content) return { count: 0, withAlt: 0, withKeyword: 0, isValid: true };
  
  const images = content.match(/<img[^>]*>/gi) || [];
  
  // Parse images to check for alt text and keyword
  const imageData = images.map(imgTag => {
    // Extract alt text - handle both alt="..." and alt='...'
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const altText = altMatch ? altMatch[1] : '';
    const hasAlt = altText.trim() !== '' && altText.toLowerCase() !== 'image';
    
    // Check if alt text contains keyword
    const hasKeyword = focusKeyword && altText.toLowerCase().includes(focusKeyword.toLowerCase());
    
    // Check if image has src (is actually uploaded/displayed)
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    const hasSrc = srcMatch && srcMatch[1].trim() !== '';
    
    return {
      hasAlt,
      hasKeyword,
      hasSrc,
      altText
    };
  });
  
  const imagesWithAlt = imageData.filter(img => img.hasAlt);
  const imagesWithKeyword = focusKeyword ? imageData.filter(img => img.hasKeyword) : [];
  const uploadedImages = imageData.filter(img => img.hasSrc);
  
  // Only count images that are actually uploaded (have src)
  const validCount = uploadedImages.length;
  const validWithAlt = uploadedImages.filter(img => img.hasAlt).length;
  const validWithKeyword = uploadedImages.filter(img => img.hasKeyword).length;
  
  // Check if all uploaded images have alt text with keyword (if keyword provided)
  const isValid = validCount === 0 || (validWithAlt === validCount && (!focusKeyword || validWithKeyword > 0));
  
  // Calculate score
  let score = 100;
  if (validCount > 0) {
    score = (validWithAlt / validCount) * 100;
    if (focusKeyword && validWithKeyword === 0 && validWithAlt > 0) {
      score = score * 0.8; // Reduce score if keyword not in alt text
    }
  }
  
  return {
    count: validCount,
    withAlt: validWithAlt,
    withKeyword: validWithKeyword,
    isValid,
    score: Math.round(score),
    recommendation: validCount === 0
      ? 'Consider adding images to make content more engaging.'
      : validWithAlt < validCount
      ? `Add alt text to ${validCount - validWithAlt} image(s) for accessibility and SEO.`
      : focusKeyword && validWithKeyword === 0
      ? `Add focus keyword "${focusKeyword}" to image alt text for better SEO.`
      : 'All images have alt text. Perfect!'
  };
};

export const calculateOverallSEOScore = (formData, focusKeyword = '') => {
  const titleAnalysis = analyzeTitle(formData.meta_title || formData.title, focusKeyword);
  const metaAnalysis = analyzeMetaDescription(formData.meta_description, focusKeyword);
  const contentAnalysis = analyzeContent(formData.content);
  const keywordAnalysis = analyzeKeywordDensity(formData.content, focusKeyword);
  const headingAnalysis = analyzeHeadings(formData.content);
  const linkAnalysis = analyzeLinks(formData.content);
  const imageAnalysis = analyzeImages(formData.content, focusKeyword);
  
  const weights = {
    title: 0.15,
    meta: 0.15,
    content: 0.20,
    keyword: 0.15,
    heading: 0.10,
    link: 0.10,
    image: 0.05,
    slug: formData.slug ? 0.05 : 0,
    ogImage: formData.og_image ? 0.05 : 0
  };
  
  const scores = {
    title: titleAnalysis.score,
    meta: metaAnalysis.score,
    content: contentAnalysis.score,
    keyword: keywordAnalysis.score,
    heading: headingAnalysis.score,
    link: linkAnalysis.score,
    image: imageAnalysis.score,
    slug: formData.slug ? 100 : 0,
    ogImage: formData.og_image ? 100 : 0
  };
  
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const weightedScore = Object.keys(scores).reduce((sum, key) => {
    return sum + (scores[key] * weights[key]);
  }, 0) / totalWeight;
  
  return Math.round(weightedScore);
};

export const generateSchemaMarkup = (formData) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": formData.meta_title || formData.title,
    "description": formData.meta_description || formData.excerpt,
    "image": formData.og_image || formData.image_url,
    "datePublished": formData.date || new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": formData.author_name || "Conbyt"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Conbyt",
      "logo": {
        "@type": "ImageObject",
        "url": "https://conbyt.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": formData.canonical_url || `https://conbyt.com/blog/${formData.slug}`
    }
  };
};

