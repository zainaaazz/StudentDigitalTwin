import React from 'react';

const GrainTexture = ({ opacity = 0.08 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full">
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="saturate"
              values="0"
            />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues={`0 ${opacity}`} />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
};

export default GrainTexture;
