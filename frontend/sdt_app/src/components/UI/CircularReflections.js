import React from 'react';

const CircularReflections = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main disc reflection - large centered */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-30"
           style={{
             background: 'radial-gradient(circle, rgba(243, 208, 255, 0.4) 0%, rgba(224, 246, 255, 0.3) 30%, rgba(255, 229, 201, 0.2) 60%, transparent 100%)',
             filter: 'blur(40px)',
           }} />

      {/* Secondary reflection - top right */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
           style={{
             background: 'radial-gradient(circle, rgba(224, 246, 255, 0.5) 0%, rgba(196, 165, 243, 0.3) 50%, transparent 100%)',
             filter: 'blur(30px)',
           }} />

      {/* Tertiary reflection - bottom left */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
           style={{
             background: 'radial-gradient(circle, rgba(255, 229, 201, 0.4) 0%, rgba(243, 208, 255, 0.3) 50%, transparent 100%)',
             filter: 'blur(50px)',
           }} />

      {/* CD grooves effect - concentric circles */}
      <svg className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-10" viewBox="0 0 500 500">
        <defs>
          <radialGradient id="grooveGradient">
            <stop offset="0%" stopColor="#C4A5F3" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E0F6FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="220" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="200" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="180" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="160" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="140" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="100" fill="none" stroke="url(#grooveGradient)" strokeWidth="0.5" />
      </svg>

      {/* Light streaks - simulating reflections */}
      <div className="absolute top-1/4 left-1/4 w-2 h-64 opacity-20 rotate-45"
           style={{
             background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
             filter: 'blur(2px)',
           }} />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-48 opacity-15 -rotate-12"
           style={{
             background: 'linear-gradient(to bottom, transparent 0%, rgba(196, 165, 243, 0.5) 50%, transparent 100%)',
             filter: 'blur(2px)',
           }} />
    </div>
  );
};

export default CircularReflections;
