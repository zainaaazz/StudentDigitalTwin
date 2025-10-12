import React, { useMemo } from 'react';

const PottedPlantVisualization = ({ stats }) => {
  // Calculate growth stage based on total interactions
  const growthStage = useMemo(() => {
    if (!stats?.totalInteractions) return 0;
    // Each 10 interactions = 1 stage, max 10 stages (full flower)
    return Math.min(Math.floor(stats.totalInteractions / 10), 10);
  }, [stats]);

  const leafCount = useMemo(() => {
    // Leaves appear from stage 1-7 (2 leaves per stage after stage 1)
    if (growthStage === 0) return 0;
    if (growthStage === 1) return 2;
    return Math.min(2 + (growthStage - 1) * 2, 14);
  }, [growthStage]);

  const hasFlower = true; // Daisy always visible

  // Generate leaf positions alternating left and right
  const leaves = useMemo(() => {
    const leafArray = [];
    const stalkHeight = 200; // Keep leaves below flower
    const stalkTop = 180; // Start well below flower (flower ends at y=160, add 20px buffer)
    const minSpacing = 35; // Minimum spacing between leaves

    for (let i = 0; i < leafCount; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      const pairIndex = Math.floor(i / 2);

      // Base position with even spacing
      const baseY = stalkTop + (pairIndex * (stalkHeight / Math.max(Math.ceil(leafCount / 2) - 1, 1)));

      // Add random offset (±15px) but ensure minimum spacing
      const randomOffset = (Math.random() - 0.5) * 30;
      let yPos = baseY + randomOffset;

      // Check spacing with previous leaves
      if (leafArray.length > 0) {
        const tooClose = leafArray.some(leaf => Math.abs(leaf.y - yPos) < minSpacing);
        if (tooClose) {
          yPos = baseY; // Fall back to base position if too close
        }
      }

      // Leaves stick out closer to stalk
      const xOffset = side === 'left' ? -35 : 35;

      leafArray.push({
        x: 400 + xOffset,
        y: yPos,
        side,
        id: i,
        flipX: side === 'left', // Flip left leaves horizontally
        stemX: 400, // Connection point on stalk
        stemY: yPos
      });
    }

    return leafArray;
  }, [leafCount]);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Information block with vine decorations */}
        <div className="relative rounded-xl p-6 shadow-sm flex items-center" style={{
          background: 'linear-gradient(135deg, #FFF8DC 0%, #F5E6D3 100%)',
          border: '4px solid #000',
          borderImage: 'linear-gradient(to right, #000 0%, #000 45%, transparent 45%, transparent 55%, #000 55%, #000 100%) 1'
        }}>
          {/* Content wrapper vertically centered */}
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2E7D32' }}>Your Interaction Growth</h3>

            <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: '#33691E' }}>Current Status</h4>
              <p className="text-md" style={{ color: '#4A4A4A' }}>
                {growthStage === 0 ? 'Start interacting to grow your plant!' :
                 growthStage < 3 ? 'Your plant is sprouting leaves!' :
                 growthStage < 5 ? 'Almost ready to bloom!' :
                 hasFlower ? 'Your plant is flowering beautifully!' : 'Your plant is growing!'}
              </p>
            </div>

            <div className="rounded-lg p-4" style={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              border: '3px solid #000'
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#2E7D32' }}>Total Interactions</p>
                  <p className="text-2xl font-bold" style={{ color: '#1B5E20' }}>
                    {stats?.totalInteractions || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#2E7D32' }}>Current Stage</p>
                  <p className="text-2xl font-bold" style={{ color: '#1B5E20' }}>
                    {growthStage}/10
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#33691E' }}>Progress to Next Stage</h4>
              <div className="w-full rounded-full h-3" style={{
                backgroundColor: '#D2B48C',
                border: '2px solid #000'
              }}>
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #7CB342 0%, #558B2F 100%)',
                    width: `${((stats?.totalInteractions || 0) % 10) * 10}%`
                  }}
                ></div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#5D4037' }}>
                {Math.max(0, (growthStage + 1) * 10 - (stats?.totalInteractions || 0))} more interactions needed
              </p>
            </div>

            <div className="pt-4 mt-4" style={{ borderTop: '2px solid #8B7355' }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#33691E' }}>How it Works</h4>
              <ul className="text-sm space-y-2" style={{ color: '#4A4A4A' }}>
                <li className="flex items-start">
                  <span className="mr-2">🌱</span>
                  <span>Every interaction helps your plant grow</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🍃</span>
                  <span>Leaves appear as you progress through stages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌼</span>
                  <span>Keep engaging to maintain your blooming flower</span>
                </li>
              </ul>
            </div>
          </div>
          </div>

          {/* Decorative vines overlaying the edges */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 600 500" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              {/* Stalk gradient for vines - Two tone green */}
              <linearGradient id="vineStalkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#7CB342', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#558B2F', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Top edge vine - running from left to right */}
            <g>
              {/* Leaves positioned away from vine */}
              {/* Leaf 1 stem and leaf - rotated 45 degrees anticlockwise, not moved closer */}
              <path d="M 70 22 L 45 -5" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="20" y="-20" width="42" height="42" transform="rotate(-90, 45, -5)" />

              {/* Leaf 2 stem and leaf - moved 2 pixels up */}
              <path d="M 150 12 L 162 -10" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="147" y="-25" width="40" height="40" transform="rotate(0, 162, -10)" />

              {/* Leaf 3 stem and leaf - rotated 135 degrees clockwise, moved slightly farther */}
              <path d="M 250 28 L 237 47" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="217" y="32" width="38" height="38" transform="rotate(180, 237, 47)" />

              {/* Leaf 4 stem and leaf - moved 2 pixels up */}
              <path d="M 350 14 L 362 -7" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="347" y="-22" width="42" height="42" transform="rotate(0, 362, -7)" />

              {/* Leaf 5 stem and leaf - rotated 135 degrees clockwise, moved slightly farther */}
              <path d="M 450 22 L 437 43" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="417" y="28" width="40" height="40" transform="rotate(180, 437, 43)" />

              {/* Leaf 6 stem and leaf - moved 2 pixels up */}
              <path d="M 550 10 L 562 -10" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="547" y="-25" width="42" height="42" transform="rotate(0, 562, -10)" />

              {/* Vine drawn last (on top of leaves) */}
              {/* Disconnected black outline sections (drawn first, thicker) */}
              <path
                d="M 0 15 C 80 25 120 5 200 20"
                stroke="#000"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Disconnect gap from 200 to 206 (tiny gap) */}
              <path
                d="M 206 20.3 C 280 35 320 10 400 18 C 480 26 520 5 600 15"
                stroke="#000"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Main vine stalk - continuous wavy line on top (drawn second, thinner) */}
              <path
                d="M 0 15 C 80 25 120 5 200 20 C 280 35 320 10 400 18 C 480 26 520 5 600 15"
                stroke="url(#vineStalkGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* Bottom edge vine - running from left to right */}
            <g>
              {/* Leaves positioned away from vine */}
              {/* Leaf 1 stem and leaf - rotated 90 degrees clockwise */}
              <path d="M 70 478 L 45 505" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="20" y="490" width="42" height="42" transform="rotate(180, 45, 505)" />

              {/* Leaf 2 stem and leaf - moved slightly closer to stalk */}
              <path d="M 150 488 L 157 502" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="142" y="487" width="40" height="40" transform="rotate(90, 157, 502)" />

              {/* Leaf 3 stem and leaf - moved closer to stalk */}
              <path d="M 250 472 L 240 455" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="220" y="440" width="38" height="38" transform="rotate(-90, 240, 455)" />

              {/* Leaf 4 stem and leaf - moved slightly closer to stalk */}
              <path d="M 350 486 L 357 500" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="342" y="485" width="42" height="42" transform="rotate(90, 357, 500)" />

              {/* Leaf 5 stem and leaf - moved closer to stalk */}
              <path d="M 450 478 L 440 460" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="420" y="445" width="40" height="40" transform="rotate(-90, 440, 460)" />

              {/* Leaf 6 stem and leaf - moved slightly closer to stalk */}
              <path d="M 550 490 L 557 503" stroke="url(#vineStalkGradient)" strokeWidth="2" fill="none" />
              <image href="/leaf.png" x="542" y="488" width="42" height="42" transform="rotate(90, 557, 503)" />

              {/* Vine drawn last (on top of leaves) */}
              {/* Disconnected black outline sections (drawn first, thicker) */}
              <path
                d="M 0 485 C 80 475 120 495 200 480"
                stroke="#000"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Disconnect gap from 200 to 206 (tiny gap) */}
              <path
                d="M 206 479.7 C 280 465 320 490 400 482 C 480 474 520 495 600 485"
                stroke="#000"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              {/* Main vine stalk - continuous wavy line on top (drawn second, thinner) */}
              <path
                d="M 0 485 C 80 475 120 495 200 480 C 280 465 320 490 400 482 C 480 474 520 495 600 485"
                stroke="url(#vineStalkGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Right side - Plant visualization */}
        <div className="relative rounded-xl shadow-sm overflow-hidden" style={{
          background: 'transparent',
          border: '4px solid #000',
          borderImage: 'linear-gradient(to right, #000 0%, #000 45%, transparent 45%, transparent 55%, #000 55%, #000 100%) 1'
        }}>

      <svg
        viewBox="0 -50 800 750"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}
      >
        {/* Cozy indoor background elements */}
        <defs>
          {/* Warm wall gradient */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFF8E7', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFE4B5', stopOpacity: 1 }} />
          </linearGradient>

          {/* Window light gradient */}
          <radialGradient id="windowLight" cx="30%" cy="20%">
            <stop offset="0%" style={{ stopColor: '#FFF9E3', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#FFE4B5', stopOpacity: 0 }} />
          </radialGradient>

          {/* Windowsill gradient */}
          <linearGradient id="windowsillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#D2B48C', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C19A6B', stopOpacity: 1 }} />
          </linearGradient>

          {/* Shadow gradient */}
          <radialGradient id="shadowGradient" cx="50%" cy="50%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
          </radialGradient>

          {/* Curtain fabric gradient */}
          <linearGradient id="curtainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#E6D7C3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#D4C5B1', stopOpacity: 1 }} />
          </linearGradient>

          {/* Book cover gradient */}
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>

          {/* Mug gradient */}
          <linearGradient id="mugGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#E8D5C4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C9B8A8', stopOpacity: 1 }} />
          </linearGradient>

          {/* Lamp base gradient */}
          <linearGradient id="lampBaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B7355', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>

          {/* Lamp shade gradient */}
          <linearGradient id="lampShadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F5E6D3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#E8D5C4', stopOpacity: 1 }} />
          </linearGradient>

          {/* Lamp glow - large ambient */}
          <radialGradient id="lampGlow" cx="80%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.5 }} />
            <stop offset="30%" style={{ stopColor: '#FFDAB9', stopOpacity: 0.3 }} />
            <stop offset="60%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#FFE4B5', stopOpacity: 0 }} />
          </radialGradient>

          {/* Warm overlay for entire scene */}
          <radialGradient id="warmOverlay" cx="85%" cy="20%">
            <stop offset="0%" style={{ stopColor: '#FFA500', stopOpacity: 0.15 }} />
            <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: '#FFE4B5', stopOpacity: 0 }} />
          </radialGradient>

          {/* Light rays gradient */}
          <radialGradient id="lightRays" cx="90%" cy="25%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0.25 }} />
            <stop offset="40%" style={{ stopColor: '#FFA500', stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: '#FFE4B5', stopOpacity: 0 }} />
          </radialGradient>

          {/* Pot gradient - Two tone brown */}
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D2691E', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
          </linearGradient>

          {/* Soil gradient - Two tone dark brown */}
          <radialGradient id="soilGradient" cx="50%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#6B4423', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4A2F1A', stopOpacity: 1 }} />
          </radialGradient>

          {/* Stalk gradient - Two tone green */}
          <linearGradient id="stalkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#7CB342', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#558B2F', stopOpacity: 1 }} />
          </linearGradient>

          {/* Leaf gradient - Two tone green */}
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#9CCC65', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7CB342', stopOpacity: 1 }} />
          </linearGradient>

          {/* Light stone gradients */}
          <linearGradient id="lightStone1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D3D3D3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#A9A9A9', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lightStone2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#E8E8E8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lightStone3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F5F5DC', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#D2B48C', stopOpacity: 1 }} />
          </linearGradient>

          {/* Sunset gradient for window - flipped */}
          <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFA07A', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#FF8C69', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#FF9A66', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFB347', stopOpacity: 1 }} />
          </linearGradient>

          {/* Sun glow - positioned for bottom */}
          <radialGradient id="sunGlow" cx="50%" cy="70%">
            <stop offset="0%" style={{ stopColor: '#FFF4E0', stopOpacity: 0.9 }} />
            <stop offset="20%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.7 }} />
            <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Warm wall background */}
        <rect x="0" y="-50" width="800" height="750" fill="url(#wallGradient)" />

        {/* Subtle wall texture lines */}
        <line x1="0" y1="200" x2="800" y2="200" stroke="#F5E6D3" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="400" x2="800" y2="400" stroke="#F5E6D3" strokeWidth="1" opacity="0.3" />

        {/* Window light effect */}
        <ellipse cx="200" cy="100" rx="400" ry="350" fill="url(#windowLight)" />

        {/* Large floor lamp in right corner - creating warm ambient lighting */}
        {/* Massive warm glow covering entire space - multiple layers for depth */}
        <ellipse cx="750" cy="200" rx="650" ry="550" fill="url(#lampGlow)" />

        {/* Warm light rays from lamp */}
        <ellipse cx="750" cy="200" rx="500" ry="450" fill="url(#lightRays)" />

        {/* Strong warm overlay for entire background/room (applied before plant is drawn) */}
        <rect x="0" y="-50" width="800" height="750" fill="url(#warmOverlay)" />

        {/* Additional warm tint layer */}
        <rect x="0" y="-50" width="800" height="750" fill="rgba(255, 200, 100, 0.12)" />

        {/* Floor lamp pole (base cut off by frame edge) */}
        <rect x="747" y="150" width="8" height="600" fill="url(#lampBaseGradient)" stroke="#000" strokeWidth="2.5" rx="4" />

        {/* Large lampshade - cylindrical/drum style */}
        <ellipse cx="750" cy="150" rx="70" ry="12" fill="url(#lampShadeGradient)" stroke="#000" strokeWidth="3" />
        <rect x="680" y="150" width="140" height="100" fill="url(#lampShadeGradient)" stroke="#000" strokeWidth="3" />
        <ellipse cx="750" cy="250" rx="70" ry="12" fill="url(#lampShadeGradient)" stroke="#000" strokeWidth="3" />

        {/* Lamp shade inner glow */}
        <ellipse cx="750" cy="200" rx="65" ry="40" fill="#FFF4E0" opacity="0.6" />

        {/* Decorative pattern on lampshade */}
        <line x1="685" y1="180" x2="815" y2="180" stroke="#D4C5B1" strokeWidth="2" opacity="0.4" />
        <line x1="685" y1="220" x2="815" y2="220" stroke="#D4C5B1" strokeWidth="2" opacity="0.4" />

        {/* Window frame with sunset view */}
        {/* Sunset background in window */}
        <rect x="40" y="10" width="270" height="320" fill="url(#sunsetGradient)" stroke="#8B7355" strokeWidth="10" rx="5" />

        {/* Sun disk with glow - at bottom for sunset */}
        <ellipse cx="175" cy="270" rx="90" ry="90" fill="url(#sunGlow)" />
        <circle cx="175" cy="270" r="35" fill="#FFF4E0" opacity="0.8" />
        <circle cx="175" cy="270" r="30" fill="#FFE4B5" />

        {/* Subtle clouds - flipped positions */}
        <ellipse cx="240" cy="80" rx="30" ry="15" fill="rgba(255, 218, 185, 0.5)" />
        <ellipse cx="260" cy="75" rx="25" ry="12" fill="rgba(255, 218, 185, 0.4)" />
        <ellipse cx="100" cy="300" rx="25" ry="12" fill="rgba(255, 228, 196, 0.4)" />
        <ellipse cx="115" cy="305" rx="20" ry="10" fill="rgba(255, 228, 196, 0.3)" />

        {/* Window frame overlay */}
        <rect x="50" y="20" width="250" height="300" fill="none" stroke="#A0826D" strokeWidth="6" rx="5" />

        {/* Window panes */}
        <line x1="175" y1="20" x2="175" y2="320" stroke="#A0826D" strokeWidth="6" />
        <line x1="50" y1="170" x2="300" y2="170" stroke="#A0826D" strokeWidth="6" />

        {/* Window glass shine/reflection */}
        <rect x="60" y="30" width="100" height="130" fill="rgba(255,255,255,0.08)" />
        <rect x="185" y="30" width="100" height="130" fill="rgba(255,255,255,0.05)" />

        {/* Curtain on left side */}
        <path d="M 20 -10 Q 30 50 25 110 Q 20 170 28 230 Q 25 290 20 350 L 45 350 Q 48 290 50 230 Q 52 170 48 110 Q 50 50 55 -10 Z"
              fill="url(#curtainGradient)" stroke="#B8A593" strokeWidth="2" />

        {/* Curtain folds - left */}
        <path d="M 30 20 Q 32 80 30 140" stroke="#C9B8A8" strokeWidth="1.5" opacity="0.6" fill="none" />
        <path d="M 38 20 Q 40 80 38 140" stroke="#C9B8A8" strokeWidth="1.5" opacity="0.6" fill="none" />

        {/* Curtain on right side */}
        <path d="M 320 -10 Q 315 50 318 110 Q 322 170 315 230 Q 318 290 320 350 L 345 350 Q 348 290 350 230 Q 352 170 348 110 Q 350 50 355 -10 Z"
              fill="url(#curtainGradient)" stroke="#B8A593" strokeWidth="2" />

        {/* Curtain folds - right */}
        <path d="M 330 20 Q 332 80 330 140" stroke="#C9B8A8" strokeWidth="1.5" opacity="0.6" fill="none" />
        <path d="M 338 20 Q 340 80 338 140" stroke="#C9B8A8" strokeWidth="1.5" opacity="0.6" fill="none" />

        {/* Windowsill - more detailed */}
        <rect x="30" y="330" width="330" height="15" fill="url(#windowsillGradient)" stroke="#8B7355" strokeWidth="2" />
        <rect x="25" y="345" width="340" height="8" fill="#A68A6E" stroke="#8B7355" strokeWidth="2" />

        {/* Decorative items on windowsill */}
        {/* Small book stack */}
        <rect x="70" y="320" width="35" height="8" fill="url(#bookGradient)" stroke="#000" strokeWidth="1.5" rx="1" />
        <rect x="73" y="312" width="30" height="8" fill="#8B7355" stroke="#000" strokeWidth="1.5" rx="1" />

        {/* Small mug */}
        <ellipse cx="285" cy="335" rx="10" ry="6" fill="url(#mugGradient)" stroke="#000" strokeWidth="1.5" />
        <rect x="275" y="323" width="20" height="12" fill="url(#mugGradient)" stroke="#000" strokeWidth="1.5" rx="2" />
        <path d="M 295 325 Q 305 328 305 332 Q 305 336 295 339" stroke="#000" strokeWidth="1.5" fill="none" />

        {/* Surface the pot sits on - wider and more detailed */}
        <rect x="100" y="630" width="600" height="25" fill="url(#windowsillGradient)" stroke="#8B7355" strokeWidth="3" rx="2" />

        {/* Wood grain lines on surface */}
        <line x1="120" y1="635" x2="680" y2="637" stroke="#A0826D" strokeWidth="1" opacity="0.4" />
        <line x1="120" y1="645" x2="680" y2="647" stroke="#A0826D" strokeWidth="1" opacity="0.3" />

        {/* Soft shadow under pot */}
        <ellipse cx="400" cy="645" rx="140" ry="15" fill="url(#shadowGradient)" />

        {/* Additional smaller shadows for depth */}
        <ellipse cx="400" cy="632" rx="80" ry="8" fill="rgba(0,0,0,0.1)" />

        {/* Pot - Two-tone brown with disconnected black outline */}
        {/* Pot Body - trapezoid shape with tight outline and disconnects */}
        <path
          d="M 220 500 L 250 630 L 550 630 L 580 500 Z"
          fill="url(#potGradient)"
        />
        {/* Disconnected outline sections on pot body */}
        <path
          d="M 220 500 L 250 630"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        {/* Disconnect gap on bottom (from 250,630 to 270,630 and 530,630 to 550,630) */}
        <path
          d="M 270 630 L 530 630"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 550 630 L 580 500"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />

        {/* Pot Rim - ellipse */}
        <ellipse
          cx="400"
          cy="500"
          rx="180"
          ry="25"
          fill="url(#potGradient)"
        />
        {/* Pot rim tight outline using proper elliptical arcs with disconnect */}
        {/* Top half of ellipse */}
        <path
          d="M 220 500 A 180 25 0 0 1 580 500"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        {/* Bottom left arc */}
        <path
          d="M 220 500 A 180 25 0 0 0 400 525"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        {/* Disconnect gap (from x=400 to x=450 at bottom) */}
        {/* Bottom right arc */}
        <path
          d="M 450 525 A 180 25 0 0 0 580 500"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />

        {/* Soil */}
        <ellipse
          cx="400"
          cy="500"
          rx="165"
          ry="22"
          fill="url(#soilGradient)"
        />

        {/* Ground effects - small pebbles and stones in the soil */}
        {/* Small pebbles scattered in soil - left side */}
        <ellipse cx="270" cy="502" rx="5" ry="4" fill="url(#lightStone1)" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="290" cy="508" rx="4" ry="3" fill="url(#lightStone2)" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="310" cy="505" rx="6" ry="4" fill="url(#lightStone3)" stroke="#000" strokeWidth="1.5" />

        {/* Small pebbles scattered in soil - right side */}
        <ellipse cx="530" cy="503" rx="5" ry="4" fill="url(#lightStone2)" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="510" cy="507" rx="4" ry="3" fill="url(#lightStone1)" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="490" cy="505" rx="6" ry="4" fill="url(#lightStone3)" stroke="#000" strokeWidth="1.5" />

        {/* Tiny pebbles near stalk */}
        <ellipse cx="360" cy="506" rx="3" ry="2" fill="url(#lightStone2)" stroke="#000" strokeWidth="1.5" />
        <ellipse cx="445" cy="507" rx="3" ry="2" fill="url(#lightStone1)" stroke="#000" strokeWidth="1.5" />

        {/* Main Stalk - two-tone green with disconnected black outline - THINNER */}
        <rect
          x="392"
          y="80"
          width="16"
          height="420"
          fill="url(#stalkGradient)"
          rx="8"
          stroke="#000"
          strokeWidth="3"
        />
        {/* Disconnected outline sections */}
        <path
          d="M 392 80 L 392 250"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        {/* Disconnect gap from 250 to 320 */}
        <path
          d="M 392 320 L 392 500"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 408 80 L 408 500"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />

        {/* Daisy flower at top - using actual daisy-flower.png - RENDER FIRST (behind leaves) */}
        {hasFlower && (
          <image
            href="/daisy-flower.png"
            x="300"
            y="-40"
            width="200"
            height="200"
          />
        )}

        {/* Render leaf stems and leaves - RENDER AFTER (on top of flower) */}
        {leaves.map((leaf) => (
          <g key={`leaf-group-${leaf.id}`}>
            {/* Stem connecting leaf to stalk */}
            <path
              d={`M ${leaf.stemX} ${leaf.stemY} L ${leaf.x} ${leaf.y}`}
              stroke="url(#stalkGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leaf image */}
            <image
              href="/leaf.png"
              x={leaf.x - 30}
              y={leaf.y - 30}
              width="60"
              height="60"
              transform={leaf.flipX ? `scale(-1, 1) translate(${-2 * leaf.x}, 0)` : ''}
            />
          </g>
        ))}

        {/* If no growth, show small sprout */}
        {growthStage === 0 && (
          <g>
            <path
              d="M 395 480 Q 385 460 375 445"
              fill="none"
              stroke="url(#stalkGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse
              cx="373"
              cy="442"
              rx="6"
              ry="4"
              fill="url(#leafGradient)"
            />
            <ellipse
              cx="373"
              cy="442"
              rx="6"
              ry="4"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
      </svg>
        </div>
      </div>
    </div>
  );
};

export default PottedPlantVisualization;
