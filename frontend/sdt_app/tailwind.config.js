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
      },
    },
  },
  plugins: [],
};