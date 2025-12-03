import React from "react";

const PatternInterrupt = () => (
  <div className="w-full flex justify-center items-center py-4">
    <div className="relative w-full max-w-5xl">
      {/* Neon animated SVG wave */}
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
        <path
          d="M0,30 Q360,60 720,30 T1440,30 V60 H0 Z"
          fill="url(#neon-gradient)"
        />
        <defs>
          <linearGradient id="neon-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FFC6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      {/* Glow effect */}
      <div className="absolute inset-0 blur-2xl opacity-40 pointer-events-none" style={{background: 'linear-gradient(90deg, #00FFC6 0%, #7C3AED 100%)'}} />
    </div>
  </div>
);

export default PatternInterrupt; 