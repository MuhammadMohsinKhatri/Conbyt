import React, { useEffect, useRef } from "react";
import spiralImg from "../assets/spiral.png";
import HeroParticles from "./HeroParticles";

const HeroSection = () => {
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const scrollCueRef = useRef(null);

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

    // Observe all elements
    [textRef.current, imageRef.current, buttonRef.current, scrollCueRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="text-text pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh]">
      {/* Animated Circuit Particles */}
      <HeroParticles />
      
      {/* Left: Text Content */}
      <div 
        ref={textRef}
        className="w-full md:w-4/5 lg:w-3/4 max-w-5xl z-20 text-left md:pl-12 flex flex-col items-start justify-center h-full opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-sans mb-4 sm:mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent2 to-accent3 drop-shadow-neon text-left">
          Unlock <span className="text-accent">AI Power</span> for<br />Your Business
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-sans font-normal text-gray-200 mb-6 sm:mb-8 md:mb-10 tracking-normal max-w-2xl text-left leading-relaxed">
          <span className="text-accent">Stop missing out.</span> AI is the new unfair advantage.<br />
          <span className="text-accent2 ">Automate, accelerate, and dominate</span> your market<br />
          with custom generative and agentic AI solutions <br />
          engineered for real-world impact.
        </p>
        <a
          ref={buttonRef}
          href="https://calendly.com/muneerhanif7/free-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-accent via-accent2 to-accent3 text-primary font-bold px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] rounded-full shadow-lg hover:scale-105 hover:from-accent2 hover:to-accent transition text-base sm:text-lg md:text-xl opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
        >
          Get My AI Edge Now
        </a>
      </div>
      
      {/* Right: Image */}
      <div 
        ref={imageRef}
        className="w-full md:w-1/2 flex justify-center md:justify-end items-center mt-6 sm:mt-8 md:mt-10 lg:mt-0 z-20 opacity-0 translate-x-8 transition-all duration-1000 ease-out delay-200"
      >
        <img
          src={spiralImg}
          alt="Spiral background"
          className="max-w-[280px] sm:max-w-[320px] md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full h-auto object-contain"
          style={{ pointerEvents: "none" }}
        />
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none z-10"></div>

      {/* Scroll to explore cue */}
      {/* <div 
        ref={scrollCueRef}
        className="absolute left-1/2 transform -translate-x-1/2 sm:left-1/4 sm:transform-none bottom-4 sm:bottom-6 flex flex-col items-center sm:items-start z-30 select-none opacity-0 translate-y-4 transition-all duration-1000 ease-out delay-500"
      >
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2 opacity-80 drop-shadow">Scroll to explore</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-accent2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div> */}

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;