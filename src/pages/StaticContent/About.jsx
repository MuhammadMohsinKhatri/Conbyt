import React, { useEffect } from 'react';
import AboutUs from '../../components/AboutUsModern';
import SEOHead from '../../components/SEO/SEOHead';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 bg-primary">
      <SEOHead 
        title="About Us | Conbyt"
        description="Learn about Conbyt, a leading AI and Machine Learning company. We empower businesses to scale and innovate with custom AI solutions."
        keywords="About Conbyt, AI company, Machine Learning company, team, vision, mission"
        canonical="https://conbyt.com/about"
      />
      <AboutUs />
    </div>
  );
};

export default About;
