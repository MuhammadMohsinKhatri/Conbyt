import React, { useEffect, useRef } from "react";
import { FaCircle, FaUser } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";

const testimonials = [
  {
    name: "Peter Devaney",
    company: "Proclaim Inc",
    text: "Their Meta Ads automation system significantly enhanced our campaign performance. Deep understanding of AI and practical execution stood out.",
  },
  {
    name: "Aden Lee",
    company: "oryany",
    text: "Conbyt's chatbot solution increased our sales dramatically. They are the best developers I have worked with.",
  },
  {
    name: "Babacar NDIAYE",
    company: "Performance Consulting Group",
    text: "Working with Conbyt was seamless. They fixed key issues in our AI system and enhanced its performance significantly.",
  },
  {
    name: "Harold Otto",
    company: "FinTech Startup",
    text: "They delivered our MVP in record time. Their expertise in AI and ML is unmatched!",
  },
];

const Testimonials = () => {
  // Refs for elements that need entrance animations
  const titleRef = useRef(null);
  const swiperContainerRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

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

    // Observe all elements
    [titleRef.current, swiperContainerRef.current, prevButtonRef.current, nextButtonRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    SwiperCore.use([Navigation, Pagination, A11y]);
    // Re-initialize navigation after render
    const swiper = document.querySelector('.testimonial-swiper')?.swiper;
    if (swiper) {
      swiper.params.navigation.prevEl = '.testimonial-swiper-prev';
      swiper.params.navigation.nextEl = '.testimonial-swiper-next';
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  return (
    <section className="py-20" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div 
          ref={titleRef}
          className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          {/* Small uppercase text above main heading */}
          <span className="uppercase tracking-widest text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-accent/80 mb-2 sm:mb-4 text-center w-full block">
            Client Voices
          </span>
          
          {/* Main heading with colored dots */}
          <div className="flex items-center justify-center gap-1 mb-6">
            <FaCircle className="text-accent text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent3 text-[8px] md:text-xs" aria-label="Accent dot" />
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mx-4 text-white tracking-tight">
              What Our Clients Say
            </h2>
            <FaCircle className="text-accent3 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] md:text-xs" aria-label="Accent dot" />
            <FaCircle className="text-accent text-[8px] md:text-xs" aria-label="Accent dot" />
          </div>
          
          {/* Description text below main heading */}
          <p className="text-center text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
            Hear directly from our satisfied clients about their experience working with Conbyt real stories of transformation, innovation, and success in the AI landscape.
          </p>
        </div>
        
        {/* Arrows at left and right, vertically centered */}
        <button 
          ref={prevButtonRef}
          className="testimonial-swiper-prev text-muted text-3xl p-2 transition hover:text-accent focus:outline-none absolute -left-12 top-1/2 -translate-y-1/2 z-20 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button 
          ref={nextButtonRef}
          className="testimonial-swiper-next text-muted text-3xl p-2 transition hover:text-accent focus:outline-none absolute -right-12 top-1/2 -translate-y-1/2 z-20 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div 
          ref={swiperContainerRef}
          className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
        >
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              nextEl: '.testimonial-swiper-next',
              prevEl: '.testimonial-swiper-prev',
            }}
            pagination={{ clickable: true, el: '.testimonial-swiper-pagination' }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="bg-surface rounded-2xl shadow-xl p-10 flex flex-col items-center text-center h-full">
                  <div className="w-24 h-24 rounded-full mb-6 shadow-lg bg-gray-300 flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-gray-600" />
                  </div>
                  <p className="text-lg md:text-xl text-text italic mb-6">"{t.text}"</p>
                  <div className="font-bold text-accent text-lg md:text-xl mb-1">{t.name}</div>
                  <div className="text-text text-base md:text-lg font-medium">{t.company}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Swiper Pagination Dots */}
          <div className="testimonial-swiper-pagination flex justify-center mt-6"></div>
        </div>

        <style jsx>{`
          .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .testimonial-swiper-pagination .swiper-pagination-bullet {
            background: #8a8fa3 !important;
            opacity: 1 !important;
            transition: background 0.2s;
          }
          .testimonial-swiper-pagination .swiper-pagination-bullet-active {
            background: #00ffc6 !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Testimonials;