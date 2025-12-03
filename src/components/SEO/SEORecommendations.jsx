import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';

const SEORecommendations = ({ analysis, focusKeyword }) => {
  const recommendations = [];

  // Title recommendations
  if (!analysis.title) {
    recommendations.push({
      type: 'error',
      icon: FaTimesCircle,
      text: 'Add a meta title (30-60 characters recommended)',
      priority: 'high'
    });
  } else if (analysis.title && !analysis.keywordInTitle && focusKeyword) {
    recommendations.push({
      type: 'warning',
      icon: FaExclamationTriangle,
      text: `Include your focus keyword "${focusKeyword}" in the title`,
      priority: 'high'
    });
  }

  // Meta description recommendations
  if (!analysis.metaDescription) {
    recommendations.push({
      type: 'error',
      icon: FaTimesCircle,
      text: 'Add a meta description (120-160 characters recommended)',
      priority: 'high'
    });
  }

  // Content length
  if (!analysis.wordCount) {
    recommendations.push({
      type: 'warning',
      icon: FaExclamationTriangle,
      text: 'Increase content length (aim for 300+ words for better SEO)',
      priority: 'medium'
    });
  }

  // Keyword density
  if (focusKeyword && !analysis.keywordDensity) {
    recommendations.push({
      type: 'warning',
      icon: FaExclamationTriangle,
      text: 'Optimize keyword density (aim for 0.5-2.5%)',
      priority: 'medium'
    });
  }

  // Headings
  if (!analysis.headings) {
    recommendations.push({
      type: 'info',
      icon: FaLightbulb,
      text: 'Improve heading structure (use 1 H1 and 2+ H2 headings)',
      priority: 'low'
    });
  }

  // Links
  if (!analysis.internalLinks) {
    recommendations.push({
      type: 'info',
      icon: FaLightbulb,
      text: 'Add internal links to related content (2+ recommended)',
      priority: 'low'
    });
  }

  if (!analysis.externalLinks) {
    recommendations.push({
      type: 'info',
      icon: FaLightbulb,
      text: 'Add external links to authoritative sources',
      priority: 'low'
    });
  }

  // Images
  if (!analysis.imageAlt) {
    recommendations.push({
      type: 'warning',
      icon: FaExclamationTriangle,
      text: 'Add alt text to all images for accessibility and SEO',
      priority: 'medium'
    });
  }

  // OG Image
  if (!analysis.ogImage) {
    recommendations.push({
      type: 'info',
      icon: FaLightbulb,
      text: 'Add Open Graph image for better social media sharing (1200x630px)',
      priority: 'low'
    });
  }

  // Positive feedback
  if (analysis.title && analysis.metaDescription && analysis.wordCount) {
    recommendations.push({
      type: 'success',
      icon: FaCheckCircle,
      text: 'Great! Your basic SEO is well optimized',
      priority: 'success'
    });
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-white/60';
    }
  };

  const sortedRecommendations = recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, success: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-3">
      {sortedRecommendations.map((rec, index) => {
        const Icon = rec.icon;
        return (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              rec.type === 'error'
                ? 'bg-red-500/10 border border-red-500/20'
                : rec.type === 'warning'
                ? 'bg-yellow-500/10 border border-yellow-500/20'
                : rec.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            <Icon className={`mt-0.5 flex-shrink-0 ${getIconColor(rec.type)}`} />
            <span className={`text-sm ${
              rec.type === 'error'
                ? 'text-red-300'
                : rec.type === 'warning'
                ? 'text-yellow-300'
                : rec.type === 'success'
                ? 'text-green-300'
                : 'text-blue-300'
            }`}>
              {rec.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SEORecommendations;

