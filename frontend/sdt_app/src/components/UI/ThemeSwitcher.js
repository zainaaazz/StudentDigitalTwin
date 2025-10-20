import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme, isKSG } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative inline-flex items-center px-6 py-3 rounded-2xl font-semibold
        tracking-wide transition-all duration-500 ease-in-out
        ${isKSG
          ? 'bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal hover:shadow-ksg-hover border border-ksg-slate/30'
          : 'bg-md-card-glass backdrop-blur-glass text-md-charcoal hover:shadow-md-hover border border-md-metallic'
        }
      `}
      style={{
        fontFamily: isKSG ? 'Poppins, sans-serif' : 'sans-serif',
        letterSpacing: isKSG ? '0.025em' : '0.05em',
        fontWeight: isKSG ? 600 : 500,
      }}
    >
      <svg
        className={`w-5 h-5 mr-2 transition-transform duration-500 ${!isKSG ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" strokeWidth="2" />
        <path
          d={isKSG
            ? "M12 1v4 M12 19v4 M23 12h-4 M5 12H1 M20.49 3.51l-2.83 2.83 M6.34 17.66l-2.83 2.83 M20.49 20.49l-2.83-2.83 M6.34 6.34L3.51 3.51"
            : "M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z"
          }
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative z-10">
        {isKSG ? 'Switch to MiniDisc' : 'Switch to KSG'}
      </span>

      {/* Glow effect on hover */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isKSG ? 'bg-gradient-to-r from-ksg-peach/20 to-ksg-lilac/20' : 'bg-md-iridescent/30'}
      `} />
    </button>
  );
};

export default ThemeSwitcher;
