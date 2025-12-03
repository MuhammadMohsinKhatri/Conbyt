import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import portfolio1 from "../assets/portfolio/1.webp";
import portfolio2 from "../assets/portfolio/2.webp";
import portfolio3 from "../assets/portfolio/3.webp";
import portfolio4 from "../assets/portfolio/4.webp";
import portfolio5 from "../assets/portfolio/5.webp";
import portfolio6 from "../assets/portfolio/6.webp";

const caseStudies = [
  {
    id: 1,
    title: "HireSense",
    description: "A platform that streamlines technical hiring with AI-powered interviews, automated evaluations, and insightful candidate analytics.",
    image: portfolio1,
    tech: ["React", "Python", "AI"],
    category: "AI Automation",
    slug: "hiresense"
  },
  {
    id: 2,
    title: "TryKicks",
    description: "A shoe shopping app with virtual try-on functionality.",
    image: portfolio2,
    tech: ["Python", "ML", "Dashboard"],
    category: "Machine Learning",
    slug: "trykicks"
  },
  {
    id: 3,
    title: "FlowAgent",
    description: "A platform where users can create custom AI agents, assistants, and workflows to automate their tasks effortlessly.",
    image: portfolio3,
    tech: ["NLP", "Healthcare", "AI"],
    category: "AI Automation",
    slug: "flowagent"
  },
  {
    id: 4,
    title: "Vocalis AI",
    description: "A platform to create AI voice agents, automate calls, boost sales, and leverage text-to-speech technology.",
    image: portfolio4,
    tech: ["React", "Python", "AI"],
    category: "Speech Recognition",
    slug: "vocalis-ai"
  },
  {
    id: 5,
    title: "Rizzko Tech Store",
    description: "An e-commerce platform with advanced product recommendations and AI-powered search functionality.",
    image: portfolio5,
    tech: ["React", "ML", "AI"],
    category: "Machine Learning",
    slug: "rizzko-tech-store"
  },
  {
    id: 6,
    title: "NeuroResume",
    description: "AI-powered resume builder with intelligent content suggestions and optimization.",
    image: portfolio6,
    tech: ["NLP", "AI", "React"],
    category: "NLP",
    slug: "neuroresume"
  }
];

const CaseStudies = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Page Title Section */}
      <section className="w-full bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-white mb-2 font-sans">Case Studies</h1>
            <p className="text-white/80 font-medium">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link> / CaseStudies
            </p>
          </div>
        </div>
      </section>
      <hr className="my-8 border-t border-surface/60 w-full" />
      {/* Introduction Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <span className="text-accent text-sm font-semibold uppercase tracking-wider">Case Studies</span>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 font-sans text-white">Transformations We've Delivered</h2>
        <p className="text-white/80 text-lg leading-relaxed font-normal">
          We specialize in cutting-edge AI and machine learning solutions that drive real business results. 
          Our portfolio showcases innovative projects that have transformed operations, increased efficiency, 
          and delivered measurable ROI for our clients across various industries.
        </p>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <div key={study.id} className="bg-surface rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
              <div className="mb-4">
                <span className="text-accent text-xs font-semibold uppercase tracking-wider">{study.category}</span>
                <h3 className="text-lg font-bold mt-2 mb-1 font-sans text-white">{study.title}</h3>
                <p className="text-sm text-white/70 font-normal">{study.description}</p>
              </div>
              
              <div className="mb-4">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap mb-6">
                {study.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <Link 
                to={`/case-study/${study.slug}`}
                className="w-full bg-gradient-to-r from-accent to-accent2 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold font-sans inline-block text-center"
              >
                View Project
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;