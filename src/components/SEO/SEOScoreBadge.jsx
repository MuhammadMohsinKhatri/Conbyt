import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const SEOScoreBadge = ({ score, size = 'md' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Needs Work';
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} ${getScoreColor(score)} rounded-full flex items-center justify-center text-white font-bold`}>
        {score}
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
        <FaChartLine className="text-white text-xs" />
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
        <span className="text-xs text-white/80">{getScoreText(score)}</span>
      </div>
    </div>
  );
};

export default SEOScoreBadge;

