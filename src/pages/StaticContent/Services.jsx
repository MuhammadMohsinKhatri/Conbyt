import React, { useEffect } from 'react';
import CircularService from '../../components/CircularService';
import SEOHead from '../../components/SEO/SEOHead';

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 bg-primary">
      <SEOHead 
        title="Services | Conbyt"
        description="Explore the AI and Machine Learning services offered by Conbyt. From AI Automations to Generative Intelligence."
        keywords="AI services, Machine Learning services, AI Automations, Generative Intelligence, Conversational AI"
        canonical="https://conbyt.com/services"
      />
      <CircularService />
    </div>
  );
};

export default Services;
