import React from 'react';

const MountFuji = ({ className = "" }) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 200"
        className="w-full h-auto opacity-20"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D3A9F8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFB6A6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Main mountain peak (Mount Fuji inspired) */}
        <path
          d="M 0 200 L 400 200 L 550 60 L 600 20 L 650 60 L 800 200 L 1200 200 Z"
          fill="url(#mountainGradient)"
        />

        {/* Snow cap on peak */}
        <path
          d="M 580 50 L 600 20 L 620 50 Z"
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* Secondary peaks (background) */}
        <path
          d="M 0 200 L 200 150 L 350 200 Z"
          fill="rgba(211, 169, 248, 0.15)"
        />
        <path
          d="M 850 200 L 950 140 L 1100 200 Z"
          fill="rgba(255, 182, 166, 0.15)"
        />
      </svg>

      {/* Floating mist gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ksg-lilac/10 via-ksg-peach/5 to-transparent"></div>
    </div>
  );
};

export default MountFuji;
