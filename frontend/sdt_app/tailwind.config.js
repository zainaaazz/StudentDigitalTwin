/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        'primary-bg-start': '#0B0E26',
        'primary-bg-end': '#1A1B4B',
        'sidebar-bg-start': '#8A5CFB',
        'sidebar-bg-end': '#4B3CFA',
        'card-bg': '#1E2246',
        'card-accent-start': '#00B8D9',
        'card-accent-end': '#36E0F8',
        'primary-text': '#66E3FF',
        'secondary-text': '#AAB3D1',
        'avatar-frame': '#15193A',
        // Navigation Panel
        'active-tab-bg': '#A68AFF',
        'inactive-tab-text': '#C9C3FF',
        'active-tab-text': '#FFFFFF',
        'logout-button': '#A3D9FF',
        // Performance Cards
        'engagement-icon-start': '#0099CC',
        'engagement-icon-end': '#00E0FF',
        'interactivity-icon-start': '#00C4CC',
        'interactivity-icon-end': '#7B68EE',
        'academic-icon-start': '#00D2B8',
        'academic-icon-end': '#33E0E0',
        'good-status-dot': '#00E0B8',
        'good-text-label': '#C7FFF6',
        // Typography & Accents
        'title-text': '#80F1FF',
        'subtitle-text': '#C4C7E5',
        'body-text': '#E6E6F0',
        'view-link': '#36E0F8',
        'general-shadow': 'rgba(0, 0, 0, 0.3)',
        // KSG-Inspired Palette
        'ksg-peach': '#FFB6A6',
        'ksg-lilac': '#D3A9F8',
        'ksg-sky': '#7FD2FF',
        'ksg-cream': '#FFE2B3',
        'ksg-teal': '#B5EAEA',
        'ksg-magenta': '#FF9CEE',
        'ksg-coral': '#FFC6A8',
        'ksg-orange': '#FFD6A5',
        'ksg-cyan': '#A0C4FF',
        // Enhanced Glass and Depth
        'ksg-glass-light': 'rgba(255, 255, 255, 0.15)',
        'ksg-glass-dark': 'rgba(30, 20, 50, 0.35)',
        'ksg-ground': '#2D2845',
        'ksg-slate': '#4A4565',
        'ksg-neutral-light': '#E8E6F0',
        'ksg-neutral': '#B8B5C9',
        'ksg-charcoal': '#1A1630',
      },
      backgroundImage: {
        'ksg-gradient': 'linear-gradient(135deg, #FFB6A6 0%, #D3A9F8 40%, #7FD2FF 70%, #FFE2B3 100%)',
        'ksg-card-deep': 'linear-gradient(135deg, rgba(30, 20, 50, 0.5) 0%, rgba(74, 69, 101, 0.4) 100%)',
        'ksg-anchor-header': 'linear-gradient(180deg, rgba(26, 22, 48, 0.7) 0%, rgba(45, 40, 69, 0.6) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
        'strong': '20px',
      },
      boxShadow: {
        'ksg-glow': '0 4px 20px rgba(255, 182, 166, 0.3)',
        'ksg-hover': '0 8px 30px rgba(211, 169, 248, 0.4)',
        'ksg-inner': 'inset 0 2px 8px rgba(0, 0, 0, 0.2)',
        'ksg-depth': '0 8px 32px rgba(26, 22, 48, 0.4)',
      },
      letterSpacing: {
        'relaxed': '0.025em',
      },
    },
  },
  plugins: [],
};