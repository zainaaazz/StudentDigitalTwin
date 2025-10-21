// Theme-aware style utilities for KSG and MiniDisc themes

export const getCardStyles = (isKSG) => ({
  container: isKSG
    ? 'backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 hover:shadow-ksg-hover'
    : 'backdrop-blur-strong bg-md-card-deep rounded-3xl shadow-md-holographic border border-md-grey-metallic hover:shadow-md-hover',
  innerGradient: isKSG
    ? 'bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40'
    : 'bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40',
});

export const getTextStyles = (isKSG) => ({
  heading: isKSG ? 'text-white' : 'text-md-charcoal',
  subheading: isKSG ? 'text-ksg-neutral-light' : 'text-md-grey',
  body: isKSG ? 'text-ksg-neutral' : 'text-md-text-soft',
  headingFont: isKSG ? 'Poppins, sans-serif' : 'sans-serif',
  headingWeight: isKSG ? 700 : 600,
  bodyWeight: 500,
  letterSpacing: '0.025em',
});

export const getChartStyles = (isKSG) => ({
  grid: 'rgba(184, 181, 201, 0.15)',
  axis: '#B8B5C9',
  tooltipBg: 'rgba(45, 40, 69, 0.95)',
  tooltipBorder: '#D3A9F8',
  tooltipColor: '#E8E6F0',
  tooltipShadow: '0 8px 20px rgba(211, 169, 248, 0.4)',
  chartBg: 'transparent',
});

export const getStatCardColors = (index, isKSG) => {
  if (isKSG) {
    const ksgColors = [
      { from: '#B5EAEA', to: '#FF9CEE', border: 'ksg-teal/50', icon: 'from-ksg-teal to-ksg-magenta' },
      { from: '#FFC6A8', to: '#FFD6A5', border: 'ksg-coral/50', icon: 'from-ksg-coral to-ksg-orange' },
      { from: '#D3A9F8', to: '#FF9CEE', border: 'ksg-lilac/50', icon: 'from-ksg-lilac to-ksg-magenta' },
      { from: '#7FD2FF', to: '#A0C4FF', border: 'ksg-cyan/50', icon: 'from-ksg-sky to-ksg-cyan' },
    ];
    return ksgColors[index % ksgColors.length];
  } else {
    const mdColors = [
      { from: '#C4A5F3', to: '#F3D0FF', border: 'md-lavender/40', icon: 'from-md-lavender to-md-lilac-soft' },
      { from: '#E0F6FF', to: '#FFE5C9', border: 'md-cyan-soft/40', icon: 'from-md-cyan-soft to-md-peach-soft' },
      { from: '#F3D0FF', to: '#E0F6FF', border: 'md-lilac-soft/40', icon: 'from-md-lilac-soft to-md-cyan-soft' },
      { from: '#FFE5C9', to: '#C4A5F3', border: 'md-peach-soft/40', icon: 'from-md-peach-soft to-md-lavender' },
    ];
    return mdColors[index % mdColors.length];
  }
};

export const getProgressBarStyles = (isKSG, colorIndex = 0) => {
  if (isKSG) {
    const gradients = [
      'from-ksg-teal to-ksg-magenta',
      'from-ksg-sky to-ksg-teal',
      'from-ksg-coral to-ksg-orange',
      'from-ksg-lilac to-ksg-magenta',
    ];
    return {
      bg: 'bg-ksg-charcoal/60 shadow-ksg-inner',
      fill: `bg-gradient-to-r ${gradients[colorIndex % gradients.length]} shadow-lg`,
    };
  } else {
    return {
      bg: 'bg-md-glass-medium/50 shadow-md-inner border border-md-grey-metallic',
      fill: 'bg-md-bar-holographic shadow-md-depth',
    };
  }
};
