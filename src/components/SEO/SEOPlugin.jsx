import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSearch, FaShareAlt, FaCode, FaChartLine, FaEye } from 'react-icons/fa';
import { calculateOverallSEOScore, generateSchemaMarkup } from '../../utils/seoAnalyzer';

const SEOPlugin = ({ formData, onUpdate }) => {
  const [seoScore, setSeoScore] = useState(0);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [analysis, setAnalysis] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [previewMode, setPreviewMode] = useState('google');

  useEffect(() => {
    if (formData) {
      const score = calculateOverallSEOScore(formData, focusKeyword);
      setSeoScore(score);
      calculateSEOScore();
      performAnalysis();
    }
  }, [formData, focusKeyword]);

  const calculateSEOScore = () => {
    const positions = analyzeKeywordPositions();
    const checks = {
      title: formData.title && formData.title.length >= 30 && formData.title.length <= 60,
      metaTitle: formData.meta_title && formData.meta_title.length >= 30 && formData.meta_title.length <= 60,
      metaDescription: formData.meta_description && formData.meta_description.length >= 120 && formData.meta_description.length <= 160,
      slug: formData.slug && formData.slug.length > 0,
      content: formData.content && formData.content.length >= 300,
      image: formData.image_url && formData.image_url.length > 0,
      focusKeyword: focusKeyword && focusKeyword.length > 0,
      keywordInTitle: positions.keywordInTitle,
      keywordInMeta: positions.keywordInMeta,
      keywordInHeading: positions.keywordInHeading,
      keywordInIntro: positions.keywordInIntro,
      headings: checkHeadings(),
      internalLinks: checkInternalLinks(),
      externalLinks: checkExternalLinks(),
      imageAlt: checkImageAlt(),
      readability: checkReadability(),
      wordCount: formData.content && formData.content.split(/\s+/).length >= 300,
      metaKeywords: formData.meta_keywords && formData.meta_keywords.length > 0,
      ogImage: formData.og_image && formData.og_image.length > 0,
      canonical: formData.canonical_url && formData.canonical_url.length > 0,
    };

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    setSeoScore(score);
    setAnalysis(checks);
  };

  const performAnalysis = () => {
    // Additional analysis will be performed here
  };

  const analyzeKeywordPositions = () => {
    const keyword = focusKeyword && focusKeyword.toLowerCase();
    const getText = str => (str || '').toLowerCase();
    const firstParagraph = formData.content ? getText(formData.content.split(/\n/)[0] || '') : '';
    // Only matches heading tags in HTML, basic level
    const headingMatch = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = formData.content ? [...(formData.content.match(headingMatch) || [])].join(' ').toLowerCase() : '';
    return {
      keywordInTitle: keyword && formData.title && getText(formData.title).includes(keyword),
      keywordInMeta: keyword && formData.meta_description && getText(formData.meta_description).includes(keyword),
      keywordInHeading: keyword && headings.includes(keyword),
      keywordInIntro: keyword && firstParagraph.includes(keyword),
    };
  };

  const checkHeadings = () => {
    if (!formData.content) return false;
    const h1Count = (formData.content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (formData.content.match(/<h2[^>]*>/gi) || []).length;
    return h1Count === 1 && h2Count >= 2; // Should have 1 H1 and at least 2 H2s
  };

  const checkInternalLinks = () => {
    if (!formData.content) return false;
    const links = (formData.content.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi) || []);
    return links.length >= 2; // Should have at least 2 internal links
  };

  const checkExternalLinks = () => {
    if (!formData.content) return false;
    const links = (formData.content.match(/<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi) || []);
    return links.length >= 1; // Should have at least 1 external link
  };

  const checkImageAlt = () => {
    if (!formData.content) return false;
    const images = (formData.content.match(/<img[^>]*>/gi) || []);
    if (images.length === 0) return true; // No images is okay
    
    // Check each image for proper alt text
    const uploadedImages = images.filter(img => {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      return srcMatch && srcMatch[1].trim() !== '';
    });
    
    if (uploadedImages.length === 0) return true; // No uploaded images is okay
    
    // Check if all uploaded images have valid alt text
    return uploadedImages.every(img => {
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      const altText = altMatch ? altMatch[1] : '';
      return altText.trim() !== '' && altText.toLowerCase() !== 'image';
    });
  };

  const checkReadability = () => {
    if (!formData.content) return false;
    const text = formData.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgSentenceLength = words.length / sentences.length;
    return avgSentenceLength >= 10 && avgSentenceLength <= 20; // Optimal sentence length
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    if (status) return <FaCheckCircle className="text-green-400" />;
    return <FaTimesCircle className="text-red-400" />;
  };

  const getStatusColor = (status) => {
    if (status) return 'text-green-400';
    return 'text-red-400';
  };

  const getWordCount = () => {
    if (!formData.content) return 0;
    return formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.ceil(words / 200); // Average reading speed: 200 words per minute
  };

  const getKeywordFrequency = () => {
    if (!focusKeyword || !formData.content) return 0;
    const text = formData.content.toLowerCase();
    const keyword = focusKeyword.toLowerCase();
    return (text.match(new RegExp(keyword, 'g')) || []).length;
  };

  const getKeywordDensity = () => {
    if (!focusKeyword || !formData.content) return 0;
    const words = formData.content.toLowerCase().replace(/<[^>]*>/g, '').split(/\s+/);
    const keywordCount = words.filter(word => word === focusKeyword.toLowerCase()).length;
    return ((keywordCount / words.length) * 100).toFixed(2);
  };

  const generateSchema = () => {
    const schema = generateSchemaMarkup(formData);
    return JSON.stringify(schema, null, 2);
  };

  const renderGooglePreview = () => {
    const title = formData.meta_title || formData.title || 'Your Title';
    const url = formData.canonical_url || `https://conbyt.com/blog/${formData.slug || 'your-slug'}`;
    const description = formData.meta_description || formData.excerpt || 'Your description will appear here...';

    return (
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="text-xs text-gray-500 mb-1">{url}</div>
        <div className="text-xl text-blue-600 hover:underline mb-1">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    );
  };

  const renderFacebookPreview = () => {
    const title = formData.meta_title || formData.title || 'Your Title';
    const description = formData.meta_description || formData.excerpt || 'Your description will appear here...';
    const image = formData.og_image || formData.image_url || 'https://via.placeholder.com/1200x630';

    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <div className="text-xs text-gray-500 uppercase mb-1">conbyt.com</div>
          <div className="text-lg font-semibold text-gray-900 mb-2">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    );
  };

  const renderTwitterPreview = () => {
    const title = formData.meta_title || formData.title || 'Your Title';
    const description = formData.meta_description || formData.excerpt || 'Your description will appear here...';
    const image = formData.og_image || formData.image_url || 'https://via.placeholder.com/1200x630';

    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
          <div className="text-sm text-gray-600 mb-2">{description}</div>
          <div className="text-xs text-gray-500">conbyt.com</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full ${getScoreBgColor(seoScore)} flex items-center justify-center`}>
              <span className="text-2xl font-bold text-white">{seoScore}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <FaChartLine className="text-white text-xs" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">SEO Analysis</h3>
            <p className="text-white/60 text-sm">Focus keyword optimization</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(seoScore)}`}>
          {seoScore >= 80 ? 'Excellent' : seoScore >= 50 ? 'Good' : 'Needs Work'}
        </div>
      </div>

      {/* Focus Keyword Input */}
      <div className="mb-6">
        <label className="block text-white mb-2 font-medium">Focus Keyword</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Enter your focus keyword"
            className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
          />
        </div>
        <p className="text-white/50 text-xs mt-1">The keyword you want to rank for</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'general' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-white'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'content' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-white'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'social' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-white'
          }`}
        >
          Social
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'preview' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-white'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'schema' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-white'
          }`}
        >
          Schema
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Basic SEO</h4>
          
          {/* Title Analysis */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.title)}
                <span className="text-white font-medium">SEO Title</span>
              </div>
              <span className={`text-sm ${getStatusColor(analysis.title)}`}>
                {formData.meta_title?.length || 0} / 60 characters
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  formData.meta_title?.length >= 30 && formData.meta_title?.length <= 60
                    ? 'bg-green-400'
                    : formData.meta_title?.length > 0
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{
                  width: `${Math.min((formData.meta_title?.length || 0) / 60 * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-white/60 text-xs">
              {!formData.meta_title
                ? 'Add a meta title'
                : formData.meta_title.length < 30
                ? 'Title is too short. Aim for 30-60 characters.'
                : formData.meta_title.length > 60
                ? 'Title is too long. Keep it under 60 characters.'
                : 'Perfect length!'}
            </p>
            {focusKeyword && (
              <p className={`text-xs mt-2 ${analysis.keywordInMeta ? 'text-green-400' : 'text-yellow-400'}`}>
                {analysis.keywordInMeta
                  ? '✓ Focus keyword found in title'
                  : '⚠ Consider adding focus keyword to title'}
              </p>
            )}
          </div>

          {/* Meta Description Analysis */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.metaDescription)}
                <span className="text-white font-medium">Meta Description</span>
              </div>
              <span className={`text-sm ${getStatusColor(analysis.metaDescription)}`}>
                {formData.meta_description?.length || 0} / 160 characters
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  formData.meta_description?.length >= 120 && formData.meta_description?.length <= 160
                    ? 'bg-green-400'
                    : formData.meta_description?.length > 0
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{
                  width: `${Math.min((formData.meta_description?.length || 0) / 160 * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-white/60 text-xs">
              {!formData.meta_description
                ? 'Add a meta description'
                : formData.meta_description.length < 120
                ? 'Description is too short. Aim for 120-160 characters.'
                : formData.meta_description.length > 160
                ? 'Description is too long. Keep it under 160 characters.'
                : 'Perfect length!'}
            </p>
            {focusKeyword && (
              <p className={`text-xs mt-2 ${formData.meta_description?.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'text-green-400' : 'text-yellow-400'}`}>
                {formData.meta_description?.toLowerCase().includes(focusKeyword.toLowerCase())
                  ? '✓ Focus keyword found in description'
                  : '⚠ Consider adding focus keyword to description'}
              </p>
            )}
          </div>

          {/* Slug Analysis */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.slug)}
                <span className="text-white font-medium">URL Slug</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.slug ? '✓ SEO-friendly URL' : 'Add a URL slug'}
            </p>
            {formData.slug && (
              <p className="text-white/40 text-xs mt-1 font-mono">
                /blog/{formData.slug}
              </p>
            )}
          </div>

          {/* Keyword Analysis */}
          {focusKeyword && (
            <div className="bg-primary/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(analysis.keywordInTitle)}
                <span className="text-white font-medium">Keyword Use</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Keyword Use: </span>
                  <span className="text-white font-semibold">
                    <span className={analysis.keywordInTitle ? 'text-green-400' : 'text-yellow-400'}>Title</span>,
                    <span className={analysis.keywordInMeta ? 'text-green-400' : 'text-yellow-400'}>Meta</span>,
                    <span className={analysis.keywordInHeading ? 'text-green-400' : 'text-yellow-400'}>Heading</span>,
                    <span className={analysis.keywordInIntro ? 'text-green-400' : 'text-yellow-400'}>Intro</span>
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-xs mt-2">
                Make sure your focus keyword appears naturally in these important locations: title, meta description, at least one heading, and once in the first paragraph. Don't repeat unnecessarily or unnaturally.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Content Analysis</h4>
          
          {/* Word Count */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.wordCount)}
                <span className="text-white font-medium">Word Count</span>
              </div>
              <span className="text-white font-semibold">{getWordCount()} words</span>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.wordCount
                ? '✓ Good content length (300+ words)'
                : '⚠ Aim for at least 300 words for better SEO'}
            </p>
          </div>

          {/* Reading Time */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Reading Time</span>
              <span className="text-white font-semibold">{getReadingTime()} min</span>
            </div>
          </div>

          {/* Headings */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.headings)}
                <span className="text-white font-medium">Heading Structure</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.headings
                ? '✓ Good heading structure (1 H1, 2+ H2s)'
                : '⚠ Improve heading structure for better SEO'}
            </p>
          </div>

          {/* Links */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.internalLinks)}
                <span className="text-white font-medium">Internal Links</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.internalLinks
                ? '✓ Good internal linking (2+ links)'
                : '⚠ Add more internal links for better SEO'}
            </p>
          </div>

          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.externalLinks)}
                <span className="text-white font-medium">External Links</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.externalLinks
                ? '✓ Good external linking (1+ links)'
                : '⚠ Add external links to authoritative sources'}
            </p>
          </div>

          {/* Images */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.imageAlt)}
                <span className="text-white font-medium">Image Alt Text</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {(() => {
                if (!formData.content) return '⚠ Add images with alt text for better SEO';
                const images = (formData.content.match(/<img[^>]*>/gi) || []);
                const uploadedImages = images.filter(img => {
                  const srcMatch = img.match(/src=["']([^"']+)["']/i);
                  return srcMatch && srcMatch[1].trim() !== '';
                });
                
                if (uploadedImages.length === 0) return 'Consider adding images to make content more engaging.';
                
                const imagesWithAlt = uploadedImages.filter(img => {
                  const altMatch = img.match(/alt=["']([^"']*)["']/i);
                  const altText = altMatch ? altMatch[1] : '';
                  return altText.trim() !== '' && altText.toLowerCase() !== 'image';
                });
                
                if (imagesWithAlt.length === uploadedImages.length) {
                  const count = uploadedImages.length;
                  const keywordCheck = focusKeyword && uploadedImages.some(img => {
                    const altMatch = img.match(/alt=["']([^"']*)["']/i);
                    const altText = altMatch ? altMatch[1] : '';
                    return altText.toLowerCase().includes(focusKeyword.toLowerCase());
                  });
                  
                  if (focusKeyword && !keywordCheck) {
                    return `✓ ${count} image${count !== 1 ? 's' : ''} have alt text, but add keyword "${focusKeyword}" for better SEO`;
                  }
                  return `✓ ${count} image${count !== 1 ? 's' : ''} ${count === 1 ? 'has' : 'have'} alt text`;
                }
                
                return `⚠ ${uploadedImages.length - imagesWithAlt.length} of ${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''} missing alt text`;
              })()}
            </p>
          </div>

          {/* Readability */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.readability)}
                <span className="text-white font-medium">Readability</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.readability
                ? '✓ Good readability score'
                : '⚠ Improve sentence length for better readability'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Social Media Optimization</h4>
          
          {/* OG Image */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(analysis.ogImage)}
                <span className="text-white font-medium">Open Graph Image</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              {analysis.ogImage
                ? '✓ OG image set (1200x630px recommended)'
                : '⚠ Add OG image for better social sharing'}
            </p>
            {formData.og_image && (
              <img src={formData.og_image} alt="OG Preview" className="mt-2 rounded-lg w-full max-w-xs" />
            )}
          </div>

          {/* Social Meta */}
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Social Sharing</span>
            </div>
            <p className="text-white/60 text-xs">
              Your content is optimized for Facebook, Twitter, and LinkedIn sharing
            </p>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPreviewMode('google')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                previewMode === 'google'
                  ? 'bg-accent text-white'
                  : 'bg-primary/40 text-white/60 hover:text-white'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setPreviewMode('facebook')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                previewMode === 'facebook'
                  ? 'bg-accent text-white'
                  : 'bg-primary/40 text-white/60 hover:text-white'
              }`}
            >
              Facebook
            </button>
            <button
              onClick={() => setPreviewMode('twitter')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                previewMode === 'twitter'
                  ? 'bg-accent text-white'
                  : 'bg-primary/40 text-white/60 hover:text-white'
              }`}
            >
              Twitter
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            {previewMode === 'google' && renderGooglePreview()}
            {previewMode === 'facebook' && renderFacebookPreview()}
            {previewMode === 'twitter' && renderTwitterPreview()}
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Schema Markup</h4>
          
          <div className="bg-primary/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">JSON-LD Schema</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateSchema());
                  alert('Schema copied to clipboard!');
                }}
                className="px-3 py-1 bg-accent text-white rounded text-sm hover:opacity-90"
              >
                Copy
              </button>
            </div>
            <pre className="bg-black/40 rounded p-4 overflow-x-auto text-xs text-white/80 font-mono">
              {generateSchema()}
            </pre>
            <p className="text-white/60 text-xs mt-2">
              Add this schema to your page's &lt;head&gt; section for rich snippets
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
        <div className="space-y-2">
          {!analysis.title && (
            <div className="flex items-start gap-2 text-sm text-yellow-400">
              <FaExclamationTriangle className="mt-0.5" />
              <span>Add a meta title (30-60 characters)</span>
            </div>
          )}
          {!analysis.metaDescription && (
            <div className="flex items-start gap-2 text-sm text-yellow-400">
              <FaExclamationTriangle className="mt-0.5" />
              <span>Add a meta description (120-160 characters)</span>
            </div>
          )}
          {focusKeyword && !analysis.keywordInTitle && (
            <div className="flex items-start gap-2 text-sm text-yellow-400">
              <FaExclamationTriangle className="mt-0.5" />
              <span>Include focus keyword in title</span>
            </div>
          )}
          {!analysis.wordCount && (
            <div className="flex items-start gap-2 text-sm text-yellow-400">
              <FaExclamationTriangle className="mt-0.5" />
              <span>Increase content length (aim for 300+ words)</span>
            </div>
          )}
          {analysis.title && analysis.metaDescription && analysis.wordCount && (
            <div className="flex items-start gap-2 text-sm text-green-400">
              <FaCheckCircle className="mt-0.5" />
              <span>Great! Your content is well optimized</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOPlugin;

