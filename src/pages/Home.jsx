import HeroSection from "../components/HeroSection";
// import PatternInterrupt from "../components/PatternInterrupt";
import TrustedBySection from "../components/TrustedBySection";
import CaseStudiesSection from "../components/CaseStudiesSection";
import Testimonials from "../components/Testimonials";
// import WorkProcedure from "../components/WorkProcedure";
import ContactForm from "../components/ContactForm";
import AboutUs from "../components/AboutUsModern";
import CircularService from "../components/CircularService";
import TechStack from "../components/TechStack";
import SectionDivider from "../components/SectionDivider";
import BlogSection from "../components/BlogSection";
import SEOHead from "../components/SEO/SEOHead";

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Conbyt",
    "url": "https://conbyt.com",
    "logo": "https://conbyt.com/assets/logo.png",
    "description": "Leading AI and machine learning solutions provider specializing in custom AI development, data analytics, and business automation.",
    "sameAs": [
      "https://linkedin.com/company/conbyt",
      "https://twitter.com/conbyt"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-CONBYT",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "Conbyt Team"
      }
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Analytics",
      "Business Automation",
      "Custom AI Development",
      "Natural Language Processing",
      "Computer Vision"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI & ML Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom AI Development",
            "description": "Tailored artificial intelligence solutions for business automation and optimization"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Machine Learning Solutions",
            "description": "Advanced ML models for predictive analytics and data-driven insights"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Data Analytics",
            "description": "Comprehensive data analysis and visualization services"
          }
        }
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="Conbyt - Transform Your Business with AI & Machine Learning Solutions"
        description="Leading AI and machine learning solutions provider. Custom AI development, data analytics, automation, and intelligent business solutions. Transform your business with cutting-edge technology."
        keywords="AI development, machine learning solutions, artificial intelligence, custom AI, business automation, data analytics, ML consulting, AI transformation, intelligent systems"
        canonical="https://conbyt.com"
        ogImage="https://conbyt.com/assets/og-homepage.jpg"
        structuredData={structuredData}
      />
      <HeroSection />
    <TrustedBySection />
    <SectionDivider />
    <AboutUs />
    <SectionDivider />
    <CircularService />
    <SectionDivider />
    <TechStack />
    <SectionDivider />
    <CaseStudiesSection />
    <SectionDivider />
    <Testimonials />
    <SectionDivider />
    <BlogSection />
    <SectionDivider />
    {/* <WorkProcedure /> */}
    <ContactForm />
  </>
  );
};

export default Home;