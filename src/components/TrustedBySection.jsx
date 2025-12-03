import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

// Import company logos
import c1 from "../assets/companies/c1.png";
import c2 from "../assets/companies/c2.svg";
import c3 from "../assets/companies/c3.png";
import c4 from "../assets/companies/c4.svg";
import c5 from "../assets/companies/c5.png";
import c6 from "../assets/companies/c6.png";
import c7 from "../assets/companies/c7.png";
import c8 from "../assets/companies/c8.png";
import c9 from "../assets/companies/c9.svg";
import c10 from "../assets/companies/c10.png";

const companyLogos = [
  { src: c1, alt: "Joblyn", large: true, link: "https://joblyn.com" },
  { src: c2, alt: "Fypease", large: true, link: "https://fypease.com" },
  { src: c3, alt: "Rizzko tech store", large: true, link: "https://rizzko.com" },
  { src: c4, alt: "Trykicks", large: true, link: "https://trykicks.com" },
  { src: c5, alt: "Hiresense" , large: true, link: "https://hiresense.com"},
  { src: c6, alt: "Vocalis AI ",large: true, link: "https://vocalisai.com" },
  { src: c7, alt: "little johnny pizza", large: true, link: "https://ljpizza.com.au/" },
  { src: c10, alt: "Flowagent", large: true, link: "https://flowagent.com" },
  { src: c8, alt: "Rizzko stays", large: true, link: "https://stays.rizzko.com" },
  { src: c9, alt: "NeuroResume", large: true, link: "https://neuroresume.com" }
];

const TrustedBySection = () => {
  return (
<section className="py-16 overflow-hidden relative">
  {/* SVG Section Divider at the top */}
  <div className="absolute top-0 left-0 w-full z-0 pointer-events-none leading-none">
    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
      <path d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" fill="#181825" />
    </svg>
  </div>
  <h2 className="text-center text-white text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide sm:tracking-wider mb-6 sm:mb-8 uppercase transition-all duration-300 relative z-10">
    Empowering global leaders through AI
  </h2>

  <div className="relative px-6 md:px-0 max-w-5xl mx-auto z-10">
    {/* Enhanced Left/Right gradient masks for better vanishing effect */}
    <div className="absolute top-0 left-0 w-10 h-full z-10 pointer-events-none bg-gradient-to-r from-primary/5 to-transparent" />
    <div className="absolute top-0 right-0 w-10 h-full z-10 pointer-events-none bg-gradient-to-l from-primary/5 to-transparent" />

    {/* Swiper Carousel */}
    <Swiper
      modules={[Autoplay]}
      spaceBetween={50}
      slidesPerView={7}
      loop={true}
      speed={1000}
      grabCursor={true}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        320: { slidesPerView: 2.5, spaceBetween: 16 },
        480: { slidesPerView: 3, spaceBetween: 20 },
        640: { slidesPerView: 4, spaceBetween: 24 },
        1024: { slidesPerView: 6, spaceBetween: 32 },
        1280: { slidesPerView: 7, spaceBetween: 48 },
      }}
      className="logo-carousel"
    >
      {companyLogos.map((logo, idx) => (
        <SwiperSlide key={idx}>
          <div className="flex justify-center items-center h-16 md:h-20 lg:h-24 transition-all duration-300">
            <a 
              href={logo.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`h-14 md:h-16 lg:h-20 w-auto object-contain select-none transition-all duration-300 ${logo.large ? 'h-20 md:h-24 lg:h-28' : ''}`}
                draggable={false}
                loading="lazy"
              />
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

  );
};

export default TrustedBySection;
