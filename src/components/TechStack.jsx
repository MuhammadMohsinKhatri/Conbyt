import React, { useEffect, useRef } from "react";
import { FaReact, FaNodeJs, FaPython, FaPhp, FaAngular, FaApple, FaAndroid, FaDocker, FaAws } from "react-icons/fa";
import { SiNextdotjs, SiExpress } from "react-icons/si";
import { SiTensorflow, SiPytorch, SiOpencv, SiHuggingface, SiKubernetes, SiFlask, SiMongodb, SiTypescript, SiJavascript } from "react-icons/si";
import { FaCircle, FaBullseye, FaEye } from "react-icons/fa";

// Import tech stack logos
import python from "../assets/techstack/python.png";
import tensorflow from "../assets/techstack/tensorflow.png";
import pytorch from "../assets/techstack/PyTorch.png";
import opencv from "../assets/techstack/opencv.png";
import huggingface from "../assets/techstack/huggingface.png";
import docker from "../assets/techstack/docker.png";
import kubernetes from "../assets/techstack/kubernetes.png";
import flask from "../assets/techstack/Flask.png";
import nodejs from "../assets/techstack/nodejs.png";
import mongodb from "../assets/techstack/MongoDB.png";
import nextjs from "../assets/techstack/Nextjs.png";
import react from "../assets/techstack/React.png";
import android from "../assets/techstack/Android.png";
import aws from "../assets/techstack/AWS.png";

const techs = [
  { name: "Python", logo: python },
  { name: "TensorFlow", logo: tensorflow },
  { name: "PyTorch", logo: pytorch },
  { name: "OpenCV", logo: opencv },
  { name: "HuggingFace", logo: huggingface },
  { name: "Docker", logo: docker },
  { name: "Kubernetes", logo: kubernetes },
  { name: "Flask", logo: flask },
  { name: "Node js", logo: nodejs },
  { name: "MongoDB", logo: mongodb },
  { name: "Next js", logo: nextjs },
  { name: "React js", logo: react },
  // { name: "IOS", logo: "/src/assets/techstack/ios.png" },
  { name: "Android", logo: android },
  { name: "AWS", logo: aws }
];

const TechStack = () => {
  // Refs for elements that need entrance animations
  const headingRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const techGridRef = useRef(null);

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
    [headingRef.current, titleRef.current, descriptionRef.current, techGridRef.current].forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24" id="tech-stack">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <span 
          ref={headingRef}
          className="uppercase tracking-widest text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-accent/80 mb-2 sm:mb-4 text-center w-full opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          Dev Toolkit
        </span>
        <div 
          ref={titleRef}
          className="flex items-center gap-1 mb-2 sm:mb-4 md:mb-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200"
        >
            <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mx-2 sm:mx-4 md:mx-6 text-white tracking-tight">
                  Our Technological Edge
              </h2>
              <FaCircle className="text-accent3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
            <FaCircle className="text-accent text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base" aria-label="Accent dot" />
        </div>
        <p 
          ref={descriptionRef}
          className="text-center text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mb-8 md:mb-14 mx-auto opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-400"
        >
          We use modern, battle-tested technologies to rapidly deliver and scale everything from MVPs to enterprise-grade solutions.
        </p>
        <div 
          ref={techGridRef}
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-y-4 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 xl:gap-y-12 gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 xl:gap-x-10 w-full justify-items-center opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600"
        >
          {techs.map((tech, i) => (
            <div key={i} className="flex flex-col items-center group">
              <img
                src={tech.logo}
                alt={tech.name + ' logo'}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 object-contain mb-1 sm:mb-2 transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-center text-text font-bold opacity-90 group-hover:text-accent mt-1 sm:mt-2">
                {tech.name}
              </span>
            </div>
          ))}
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

export default TechStack;