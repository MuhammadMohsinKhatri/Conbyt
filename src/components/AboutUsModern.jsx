import React, { useEffect, useRef } from "react";
import { FaCircle, FaBullseye, FaEye } from "react-icons/fa";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

const stats = [
  { label: "Projects Completed", value: 50, color: "accent" },
  { label: "Trusted Partners", value: 5, color: "accent2" },
  { label: "Years", value: 2, color: "accent3" },
  { label: "Ongoing Projects", value: 4, color: "accent2" },
];

const colorClasses = {
  accent: "text-accent border-accent from-accent to-accent",
  accent2: "text-accent2 border-accent2 from-accent2 to-accent2",
  accent3: "text-accent3 border-accent3 from-accent3 to-accent3",
};

import about3 from "../assets/about3.webp";
import about2 from "../assets/about2.webp";
import about1 from "../assets/about1.webp";


const images = [
  { src: about3, alt: "AI team brainstorming in modern workspace" },
  { src: about2, alt: "Developers collaborating on project" },
  { src: about1, alt: "Creative designers at work" },
];

const timeline = [
  {
    label: "Our Mission",
    icon: <FaBullseye className="text-accent text-2xl" aria-label="Mission icon" />,
    color: "accent",
    desc: "To empower businesses to scale and innovate by providing custom, generative, and agentic AI solutions that deliver measurable impact.",
  },
  {
    label: "Our Vision",
    icon: <FaEye className="text-accent2 text-2xl" aria-label="Vision icon" />,
    color: "accent2",
    desc: "To become the leading force in AI-driven innovation—making powerful, transformative AI accessible to organizations of all sizes across industries.",
  },
];

const AboutUsModern = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Reduce parallax range for performance and disable on mobile
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const y = useTransform(scrollYProgress, [0, 1], [0, 8]);

  // Refs for elements that need entrance animations
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const statsContainerRef = useRef(null);
  const imagesContainerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe elements that don't have Framer Motion animations
    [titleRef.current, descriptionRef.current, ctaRef.current, statsContainerRef.current, imagesContainerRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section id="aboutus" className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 text-white font-sans flex items-center justify-center min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[750px]">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center justify-between">
        {/* Left: Images - responsive and creative overlap with parallax */}
        <div className="flex-[0_0_100%] w-full max-w-full md:flex-[0_0_50%] md:max-w-[50%] lg:flex-[0_0_48%] lg:max-w-[48%] xl:flex-[0_0_50%] xl:max-w-[50%] flex flex-col items-center md:items-start mb-8 md:mb-0 md:pl-4 lg:pl-6 xl:pl-8 2xl:pl-12">
          <motion.div ref={ref} style={isDesktop ? { y, willChange: "transform" } : {}} className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px] flex flex-col items-center">
            {/* Main large image - positioned responsively */}
            <img 
              src={images[0].src} 
              alt={images[0].alt} 
              loading={isMobile ? "eager" : "lazy"}
              fetchpriority={isMobile ? "high" : "auto"}
              decoding="async"
              className="absolute z-30 w-[200px] h-[240px] sm:w-[240px] sm:h-[280px] md:w-[280px] md:h-[320px] lg:w-[320px] lg:h-[360px] xl:w-[360px] xl:h-[400px] 2xl:w-[400px] 2xl:h-[440px] object-cover object-center rounded-3xl shadow-2xl border-4 border-surface"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(0,223,178,0.15)',
                left: '10%',
                top: '5%'
              }} 
            />
            {/* Second image - positioned responsively */}
            <img 
              src={images[1].src} 
              alt={images[1].alt} 
              loading={isMobile ? "eager" : "lazy"}
              fetchpriority={isMobile ? "high" : "auto"}
              decoding="async"
              className="absolute z-20 w-[180px] h-[220px] sm:w-[220px] sm:h-[260px] md:w-[260px] md:h-[300px] lg:w-[300px] lg:h-[340px] xl:w-[340px] xl:h-[380px] 2xl:w-[380px] 2xl:h-[420px] object-cover object-center rounded-3xl shadow-xl border-4 border-surface"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.12)',
                right: '15%',
                top: '25%'
              }} 
            />
            {/* Third image - positioned responsively */}
            <img 
              src={images[2].src} 
              alt={images[2].alt} 
              loading={isMobile ? "eager" : "lazy"}
              fetchpriority={isMobile ? "high" : "auto"}
              decoding="async"
              className="absolute z-10 w-[140px] h-[160px] sm:w-[160px] sm:h-[180px] md:w-[180px] md:h-[200px] lg:w-[200px] lg:h-[220px] xl:w-[220px] xl:h-[240px] 2xl:w-[240px] 2xl:h-[260px] object-cover object-center rounded-2xl shadow-lg border-4 border-surface"
              style={{ 
                boxShadow: '0 8px 32px 0 rgba(255,184,107,0.10)',
                left: '20%',
                bottom: '10%'
              }} 
            />
          </motion.div>
        </div>
        {/* Right: Content - spread more space */}
        <div className="flex-[0_0_100%] w-full max-w-full md:flex-[0_0_50%] md:max-w-[50%] lg:flex-[0_0_52%] lg:max-w-[52%] xl:flex-[0_0_50%] xl:max-w-[50%] flex flex-col items-center md:items-start md:pr-4 lg:pr-6 xl:pr-8 2xl:pr-12">
          <div 
            ref={titleRef}
            className="flex items-center gap-1 mb-2 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          >
          <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mx-2 sm:mx-4 text-white tracking-tight">Who We Are</h2>
          <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          </div>
          <p 
            ref={descriptionRef}
            className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mb-4 text-center md:text-left opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
          >
          We're a B2B AI services company made up of engineers, designers, and product strategists who specialize in building cutting-edge generative and agentic AI systems. We partner with businesses to solve complex challenges, automate workflows, and unlock new growth opportunities through intelligent, enterprise-grade solutions.
          </p>
          {/* Mission & Vision Timeline - perfectly aligned */}
          <section aria-label="Mission and Vision Timeline" className="w-full flex flex-col gap-6 sm:gap-8 mb-6 relative">
            {timeline.map((step, i) => (
              <motion.article
                key={step.label}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-row sm:flex-row items-start gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 z-10 w-full justify-center md:justify-center lg:justify-start"
                aria-label={step.label}
              >
                {/* Icon and connector */}
                <div className="flex flex-col items-center relative mr-2 sm:mr-0 mt-1" aria-hidden="true">
                  <span className={`w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center rounded-full bg-surface border-4 ${colorClasses[step.color]} shadow-lg z-10`}>
                    {step.icon}
                  </span>
                  {i < timeline.length - 1 && (
                    <span className="absolute left-5 sm:left-6 md:left-7 w-1 h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36 bg-gradient-to-b from-accent2 to-accent3 opacity-60 rounded-full z-0" style={{ top: '100%' }} />
                  )}
                </div>
                {/* Text */}
                <div className="flex-1 text-left md:text-center lg:text-left">
                  <h3 className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold text-white mb-1 mt-1 sm:mt-0">{step.label}</h3>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg">{step.desc}</p>
                </div>
              </motion.article>
            ))}
          </section>
          {/* Animated Stats Bars with glassmorphism and hover */}
          <section 
            ref={statsContainerRef}
            aria-label="Company Stats" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col gap-3 mt-2 bg-white/5 rounded-xl p-4 sm:p-5 md:p-4 lg:p-6 xl:p-8 shadow-lg opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
          >
            {stats.map((stat, i) => {
              const statRef = useRef(null);
              const inView = useInView(statRef, { once: true, margin: "-50px" });
              return (
                <div key={stat.label} className="flex flex-col gap-1 transition transform hover:scale-105 duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-white font-semibold">{stat.label}</span>
                    <span className={`text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold ${colorClasses[stat.color]}`}
                      ref={statRef}
                    >
                      <CountUp end={inView ? stat.value : 0} duration={1.5} />+
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(stat.value, 100)}%` }}
                    transition={{ duration: 1.2 + i * 0.3, type: "spring" }}
                    viewport={{ once: true }}
                    className={`h-2 sm:h-2.5 md:h-2.5 lg:h-3 xl:h-4 rounded-lg bg-gradient-to-r ${colorClasses[stat.color]} shadow-inner`}
                    style={{ width: `${Math.min(stat.value, 100)}%` }}
                  />
                </div>
              );
            })}
          </section>
          {/* CTA Link */}
          <a 
            ref={ctaRef}
            href="#contact"
            className="text-accent hover:underline font-semibold mt-4 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl inline-block opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Let's Build Something Together &rarr;
          </a>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Image rendering: avoid GPU-forcing transforms on mobile to prevent flicker */
        img {
          -webkit-font-smoothing: antialiased;
        }

        @media (min-width: 768px) {
          img {
            backface-visibility: hidden;
            transform: translateZ(0);
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUsModern; 