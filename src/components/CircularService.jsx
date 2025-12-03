import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaCogs, FaBolt, FaBullhorn, FaTimes, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaCircle, FaBullseye, FaEye } from "react-icons/fa";

const services = [
  {
    name: "AI Automations",
    icon: <FaBolt className="text-5xl md:text-6xl" />, color: "accent",
    border: "ring-accent/80 shadow-accent/40",
    glow: "shadow-[0_0_48px_0_#00ffc6aa]",
    desc: "We help businesses automate time-consuming, human-like tasks such as customer support, document handling, and data analysis, allowing your team to focus on high-impact work. Replace manual operations with intelligent systems that work around the clock.",
  },
  {
    name: "Generative Intelligence",
    icon: <FaRobot className="text-5xl md:text-6xl" />, color: "accent3",
    border: "ring-accent3/80 shadow-accent3/40",
    glow: "shadow-[0_0_48px_0_#d4ff37aa]",
    desc: "We build solutions that generate content, insights, and communication, just like a human would. Ideal for teams looking to scale customer engagement, streamline communication, or power content-heavy operations. Unlock efficiency with smart, generative systems.",
  },
  {
    name: "Conversational AI",
    icon: <FaCogs className="text-5xl md:text-6xl" />, color: "accent2",
    border: "ring-accent2/80 shadow-accent2/40",
    glow: "shadow-[0_0_48px_0_#7c3aedaa]",
    desc: "We build AI systems that can understand and respond through voice and text, including chatbots, voice agents, and virtual assistants. Whether it's customer support, lead qualification, or internal automation, our solutions help businesses communicate at scale with human-like intelligence.",
  },
  {
    name: "AI Product Development",
    icon: <FaBullhorn className="text-5xl md:text-6xl" />, color: "accent",
    border: "ring-accent/80 shadow-accent/40",
    glow: "shadow-[0_0_48px_0_#00ffc6aa]",
    desc: "We bring your AI product idea to life, from concept to launch. Whether you're solving a specific business problem or creating something entirely new, we help you design and build software that delivers clear, measurable results. End-to-end development for automation-first digital products.",
  },
  {
    name: "MVPs",
    icon: <FaBullhorn className="text-5xl md:text-6xl" />, color: "accent2",
    border: "ring-accent2/80 shadow-accent2/40",
    glow: "shadow-[0_0_48px_0_#7c3aedaa]",
    desc: "We help founders and businesses rapidly turn concepts into working MVPs that prove value, attract funding, or onboard early customers. Fast, focused execution for bold, AI-first visions.",
  },
  // {
  //   name: "E‑commerce Solutions",
  //   icon: <FaShoppingCart className="text-5xl md:text-6xl" />, color: "accent3",
  //   border: "ring-accent3/80 shadow-accent3/40",
  //   glow: "shadow-[0_0_48px_0_#d4ff37aa]",
  //   desc: "We build online stores from no‑code (WordPress, Shopify) to high‑end custom stacks (Django, React) — scalable, fast, and tailored to your operations.",
  // }
];

// Perfect half-circle arc positions (symmetric, mathematically even)
const getWideArcPositions = (radius, centerX, centerY, count) => {
  // Arc from 180deg (left) to 360deg (right) for a perfect semicircle
  const start = Math.PI; // 180deg
  const end = 2 * Math.PI; // 360deg
  return Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1);
    const angle = start + (end - start) * t;
    return {
      left: centerX + radius * Math.cos(angle),
      top: centerY + radius * Math.sin(angle),
    };
  });
};

// Render a beaded/dotted border using small circles
const BeadedBorder = ({ size = 160, beads = 12, color = "#00ffc6" }) => {
  const r = size / 2 - 10;
  return (
    <svg width={size} height={size} className="absolute left-0 top-0 pointer-events-none" style={{zIndex:1}}>
      {Array.from({ length: beads }).map((_, i) => {
        const angle = (2 * Math.PI * i) / beads;
        const cx = size / 2 + r * Math.cos(angle);
        const cy = size / 2 + r * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r={5} fill={color} opacity={0.7} />;
      })}
    </svg>
  );
};

const CircularService = () => {
  const [active, setActive] = useState(2); // Default to Product Engineering
  const sectionRef = useRef(null);

  // Refs for elements that need entrance animations
  const headingRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const orbitContainerRef = useRef(null);

  // Keyboard accessibility: ESC to close detail
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && active !== null) setActive(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  // Intersection Observer for scroll-triggered animations
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
    [headingRef.current, titleRef.current, descriptionRef.current, orbitContainerRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Responsive perfect half-circle layout
  const [dimensions, setDimensions] = useState({ w: 1200, h: 700, r: 340 });
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 380) {
        setDimensions({ w: 320, h: 280, r: 110 });
      } else if (width < 640) {
        setDimensions({ w: 360, h: 320, r: 120 });
      } else if (width < 768) {
        setDimensions({ w: 600, h: 400, r: 200 });
      } else if (width < 1024) {
        setDimensions({ w: 800, h: 500, r: 280 });
      } else if (width < 1280) {
        setDimensions({ w: 1000, h: 600, r: 320 });
      } else {
        setDimensions({ w: 1200, h: 700, r: 340 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const isTiny = typeof window !== 'undefined' && window.innerWidth < 380;
  const arc = getWideArcPositions(
    dimensions.r,
    (dimensions.w / 2) + (window.innerWidth >= 1024 ? -10 : 0) + (isTiny ? 0 : 0),
    (dimensions.h / 2) + (isTiny ? 10 : 30),
    services.length
  );

  // Bead color per service
  const beadColors = ["#00ffc6", "#d4ff37", "#7c3aed", "#00ffc6", "#7c3aed"];

  return (
    <section id="services" ref={sectionRef} className="relative w-full flex flex-col items-center justify-center overflow-hidden py-50 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 pb-56 sm:pb-31 md:pb-12 lg:pb-10">
      {/* Heading & Subtext */}
      <div className="max-w-8xl w-full mx-auto flex flex-col items-center justify-center mb-8 md:mb-12 mt-4 md:mt-6">
        <span 
          ref={headingRef}
          className="uppercase tracking-widest text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-accent/80 mb-2 md:mb-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          Our Services
        </span>
        <div 
          ref={titleRef}
          className="flex items-center justify-center gap-1 mb-2 md:mb-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
        >
          <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-center mx-2 md:mx-4 text-white drop-shadow-neon">
                Enterprise-Ready Intelligence
          </h2>
          <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
          <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
        </div>
        <p 
          ref={descriptionRef}
          className="text-center text-white/80 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mb-4 sm:mb-4 md:mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
        >
       We equip businesses with next-gen AI to automate processes, extract insights, and stay competitive in fast-moving markets.
        </p>
      </div>
      {/* Orbit Circles (Half-circle) */}
      <div 
        ref={orbitContainerRef}
        className="relative mx-auto flex items-center justify-center -mt-8 sm:mt-0 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600" 
        style={{ width: dimensions.w, height: Math.min(dimensions.h, 800), maxWidth: '100vw' }}
      >
        {/* Service Circles */}
        {services.map((s, i) => (
          <motion.button
            key={s.name + i}
                          className={`absolute flex items-center justify-center ${
                            isTiny ? 'w-16 h-16' : (window.innerWidth < 770 ? 'w-20 h-20' : 'w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40')
                          } rounded-full bg-surface/80 ring-4 ${s.border} ${s.glow} transition-all duration-300 select-none focus:outline-none focus:ring-4 focus:ring-accent/40 pointer-events-auto ${active !== null && active !== i ? 'opacity-60' : ''}`}
              style={{
                left: arc[i].left - (isTiny ? 32 : (window.innerWidth < 770 ? 40 : window.innerWidth < 768 ? 64 : 80)),
                top: arc[i].top - (isTiny ? 32 : (window.innerWidth < 770 ? 40 : window.innerWidth < 768 ? 64 : 80)),
                zIndex: 2,
              }}
            onClick={() => setActive(i)}
            tabIndex={0}
            aria-label={s.name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
          >
            <span className={`text-white text-center font-bold leading-tight drop-shadow-neon ${isTiny ? 'px-0.5' : 'px-1'} sm:px-2 z-10 w-full break-words`} style={{ fontSize: `${(isTiny ? 16 : (window.innerWidth < 770 ? 18 : (window.innerWidth < 1024 ? 22 : 28))) * 0.55}px`, lineHeight: 1.1 }}>
              {s.name}
            </span>
          </motion.button>
        ))}
        {/* Detail Div: Positioned below all circles for mobile */}
        {active !== null && (() => {
          const pe = arc[2];
          return (
            <motion.div
              className={`absolute flex flex-col items-center justify-center p-2 sm:p-4 md:p-20 max-w-xs sm:max-w-lg w-[95vw] md:w-[600px] mx-auto pr-2 ${isTiny ? 'px-1 max-w-[90vw]' : ''}`}
                             style={
                 window.innerWidth < 770
                   ? {
                       left: isTiny ? '0%' : '5%',
                       transform: 'translateX(-50%)',
                       top: pe.top + 120,
                       zIndex: 1,
                     }
                   : {
                       left: pe.left - (window.innerWidth < 768 ? 115 : 230) / 2 - (window.innerWidth < 125 ? 8 : 125),
                       top: pe.top + (window.innerWidth < 640 ? 72 : 80) - 20,
                       zIndex: 1,
                     }
               }
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="mb-2 md:mb-4">{services[active].icon}</div>
              <h3 className={`${isTiny ? 'text-sm leading-tight' : 'text-base'} sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent2 to-accent3 drop-shadow-neon`}>
                {services[active].name}
              </h3>
              <p className={`${isTiny ? 'text-xs leading-snug' : 'text-sm'} sm:text-xs md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white/80 text-center mb-3 md:mb-4 max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full`} style={{ wordBreak: 'break-word', hyphens: 'auto', overflowWrap: 'anywhere' }}>
                {services[active].desc}
              </p>
              <a
                href="https://calendly.com/muneerhanif7/free-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-accent via-accent2 to-accent3 text-primary font-extrabold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl shadow-lg hover:scale-105 hover:from-accent2 hover:to-accent transition"
                tabIndex={0}
              >
                Let's Talk
              </a>
            </motion.div>
          );
        })()}
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

export default CircularService;