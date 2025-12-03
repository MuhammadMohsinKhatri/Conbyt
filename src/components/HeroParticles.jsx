import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const HeroParticles = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <Particles
      id="hero-atom-particles"
      init={particlesInit}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      options={{
        background: { color: "transparent" },
        fullScreen: false,
        fpsLimit: 30,
        particles: {
          number: { value: isSmallScreen ? 50 : 40, density: { enable: true, area: 1000 } },
          color: { value: ["#00ffc6", "#7c3aed", "#d4ff37"] },
          shape: { type: "circle" },
          opacity: { value: 0.6, random: false },
          size: { value: isSmallScreen ? 3 : 4, random: { enable: true, minimumValue: isSmallScreen ? 1.5 : 2 } },
          links: {
            enable: true,
            distance: isSmallScreen ? 110 : 140,
            color: "#00ffc6",
            opacity: isSmallScreen ? 0.35 : 0.4,
            width: isSmallScreen ? 0.8 : 1,
          },
          move: {
            enable: true,
            speed: isSmallScreen ? 0.3 : 0.4,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
            attract: { enable: false },
          },
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
            resize: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default HeroParticles; 