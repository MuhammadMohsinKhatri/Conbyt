import React, { useEffect } from 'react';
import ContactForm from '../../components/ContactForm';
import SEOHead from '../../components/SEO/SEOHead';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 bg-primary">
      <SEOHead 
        title="Contact Us | Conbyt"
        description="Get in touch with Conbyt for AI and Machine Learning solutions. We are ready to help you transform your business."
        keywords="Contact Conbyt, AI solutions, Machine Learning solutions, contact form, hire AI developers"
        canonical="https://conbyt.com/contact"
      />
      <ContactForm />
    </div>
  );
};

export default Contact;
