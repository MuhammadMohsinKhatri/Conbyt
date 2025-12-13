import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { fetchCaseStudies } from "../utils/api";

// Import portfolio images
import portfolio1 from "../assets/portfolio/1.webp";
import portfolio2 from "../assets/portfolio/2.webp";
import portfolio3 from "../assets/portfolio/3.webp";
import portfolio4 from "../assets/portfolio/4.webp";

// Fallback case studies
const fallbackCaseStudies = [
  {
    title: "HireSense",
    description: "A platform that streamlines technical hiring with AI-powered interviews, automated evaluations, and insightful candidate analytics.",
    image: portfolio1,
    tech: ["React", "Python", "AI"],
    link: "/case-studies",
  },
  {
    title: "TryKicks",
    description: "A shoe shopping app with virtual try-on functionality.",
    image: portfolio2,
    tech: ["Python", "ML", "Dashboard"],
    link: "/case-studies",
  },
  {
    title: "FlowAgent",
    description: "A platform where users can create custom AI agents, assistants, and workflows to automate their tasks effortlessly.",
    image: portfolio3,
    tech: ["NLP", "Healthcare", "AI"],
    link: "/case-studies",
  },
  {
    title: "Vocalis AI",
    description: "A platform to create AI voice agents, automate calls, boost sales, and leverage text-to-speech technology.",
    image: portfolio4,
    tech: ["React", "Python", "AI"],
    link: "/case-studies",
  },
];

const CaseStudiesSection = () => {
  const [caseStudies, setCaseStudies] = useState(fallbackCaseStudies.slice(0, 4)); // Show only first 4 on homepage
  const [loading, setLoading] = useState(true);
  
  const titleRef = useRef(null);
  const caseStudiesGridRef = useRef(null);
  const ctaRef = useRef(null);

  // Load dynamic case studies
  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setLoading(true);
        const dynamicCaseStudies = await fetchCaseStudies();
        if (dynamicCaseStudies && dynamicCaseStudies.length > 0) {
          setCaseStudies(dynamicCaseStudies.slice(0, 4)); // Show only first 4 on homepage
        }
      } catch (error) {
        console.error('Error loading case studies:', error);
        // Keep fallback case studies
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    [titleRef.current, caseStudiesGridRef.current, ctaRef.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4" id="case-studies">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div
          ref={titleRef}
          className="text-center mb-10 sm:mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          {/* Small uppercase text above main heading */}
          <span className="uppercase tracking-widest text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-accent/80 mb-2 sm:mb-4 text-center w-full block">
            Success Stories
          </span>
          
          {/* Main heading with colored dots */}
          <div className="flex items-center justify-center gap-1 flex-wrap mb-6">
            <FaCircle className="text-accent text-[8px] md:text-xs" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" />
            <FaCircle className="text-accent3 text-[8px] md:text-xs" />
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mx-4">
              What We've Done
            </h2>
            <FaCircle className="text-accent3 text-[8px] md:text-xs" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" />
            <FaCircle className="text-accent text-[8px] md:text-xs" />
          </div>
          
          {/* Description text below main heading */}
          <p className="text-center text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
            Discover how we've transformed businesses with cutting-edge AI solutions, from startups to enterprise clients delivering measurable results and innovative outcomes.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div
          ref={caseStudiesGridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
        >
          {caseStudies.slice(0, 4).map((cs, i) => {
            const imageUrl = cs.image_url || cs.image || portfolio1;
            const techArray = Array.isArray(cs.tech) ? cs.tech 
                             : cs.technologies ? cs.technologies.split(',').map(t => t.trim())
                             : cs.tech_stack ? cs.tech_stack.split(',').map(t => t.trim())
                             : ['AI', 'ML'];
            return (
            <div
              key={cs.id || i}
              className="bg-surface max-w-sm mx-auto w-full rounded-2xl overflow-hidden flex flex-col items-center shadow-lg group"
            >
              <div className="relative w-full group/image">
                <img
                  src={imageUrl}
                  alt={cs.title}
                  className="w-full h-52 sm:h-60 md:h-72 object-cover transition duration-300"
                  loading="lazy"
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  onError={(e) => {
                    e.target.src = portfolio1; // Fallback image
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Link
                  to={cs.link || `/case-study/${cs.slug || cs.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  tabIndex={-1}
                >
                  <span className="bg-gradient-to-r from-accent to-accent2 text-primary font-bold px-5 py-2 rounded-full shadow-lg text-sm sm:text-base hover:scale-105 transition">
                    View details
                  </span>
                </Link>
              </div>
                             <div className="w-full flex flex-col items-start justify-end p-4 sm:p-5">
                 <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 text-left">
                   {cs.title}
                 </h3>
                 <div className="flex items-center mb-2 w-full">
                   <div
                     className="h-0.5 bg-white/60"
                     style={{
                       width: "100px",
                       maxWidth: "100%",
                       flex: `0 0 ${cs.title.length}ch`,
                     }}
                   />
                   <div className="w-2 h-2 bg-accent rounded-full ml-2"></div>
                 </div>
                 <p className="text-xs sm:text-sm text-white/70 font-normal mb-2 text-left">
                   {cs.description || cs.short_description || cs.excerpt}
                 </p>
                <div className="flex gap-2 flex-wrap">
                  {techArray.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div
          ref={ctaRef}
          className="flex justify-center mt-10 sm:mt-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
        >
          <Link
            to="/case-studies"
            className="inline-block bg-gradient-to-r from-accent to-accent2 text-primary font-bold px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg hover:scale-105 hover:from-accent2 hover:to-accent transition text-sm sm:text-base md:text-lg"
          >
            View More Projects
          </Link>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default CaseStudiesSection;
