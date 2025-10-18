import React, { useMemo } from 'react';
import { Sprout, Users, Leaf, Flower2, TrendingUp } from 'lucide-react';

const PottedPlantVisualization = ({ stats, showHeading = false }) => {
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

  // Calculate progress percentage
  const progressPercent = ((stats?.totalInteractions || 0) % 10) * 10;
  const interactionsNeeded = Math.max(0, (growthStage + 1) * 10 - (stats?.totalInteractions || 0));

  // Generate leaf positions alternating left and right
  const leaves = useMemo(() => {
    const leafArray = [];
    const stalkHeight = 200;
    const stalkTop = 180;
    const minSpacing = 35;

    for (let i = 0; i < leafCount; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      const pairIndex = Math.floor(i / 2);
      const baseY = stalkTop + (pairIndex * (stalkHeight / Math.max(Math.ceil(leafCount / 2) - 1, 1)));
      const randomOffset = (Math.random() - 0.5) * 30;
      let yPos = baseY + randomOffset;

      if (leafArray.length > 0) {
        const tooClose = leafArray.some(leaf => Math.abs(leaf.y - yPos) < minSpacing);
        if (tooClose) {
          yPos = baseY;
        }
      }

      const xOffset = side === 'left' ? -35 : 35;

      leafArray.push({
        x: 400 + xOffset,
        y: yPos,
        side,
        id: i,
        flipX: side === 'left',
        stemX: 400,
        stemY: yPos
      });
    }

    return leafArray;
  }, [leafCount]);

  // Status message based on growth stage
  const getStatusMessage = () => {
    if (growthStage === 0) return 'Begin your journey';
    if (growthStage < 3) return 'Growth initiated';
    if (growthStage < 5) return 'Nearing maturity';
    if (hasFlower) return 'Peak performance';
    return 'Progressing';
  };

  return (
    <div className="w-full rounded-2xl p-1" style={{
      background: 'linear-gradient(135deg, #00C2FF 0%, #1AE0B6 100%)',
      boxShadow: '0 0 40px rgba(0, 194, 255, 0.3)'
    }}>
      <div className="rounded-xl p-6" style={{
        background: 'linear-gradient(180deg, #0C1B3B 0%, #122B59 100%)',
      }}>
        {showHeading && (
          <div className="text-center mb-8 p-6 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(12, 27, 59, 0.8) 0%, rgba(18, 43, 89, 0.6) 100%)',
            border: '2px solid rgba(0, 194, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 194, 255, 0.2), inset 0 0 20px rgba(0, 194, 255, 0.05)'
          }}>
            <h2 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3" style={{
              color: '#80F1FF',
              textShadow: '0 0 20px rgba(0, 194, 255, 0.5)'
            }}>
              <Sprout size={36} strokeWidth={2.5} style={{ color: '#1AE0B6' }} />
              Your Social Garden
              <Sprout size={36} strokeWidth={2.5} style={{ color: '#1AE0B6' }} />
            </h2>
            <p className="text-lg" style={{
              color: '#AAB3D1',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Every interaction with your classmates helps your plant grow. Build connections and watch it flourish!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Information block */}
          <div className="relative rounded-xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(12, 27, 59, 0.9) 0%, rgba(18, 43, 89, 0.8) 100%)',
            border: '2px solid rgba(0, 194, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 194, 255, 0.2), inset 0 0 30px rgba(0, 194, 255, 0.03)'
          }}>
            {/* Blue glow effect behind content */}
            <div className="absolute inset-0 opacity-20" style={{
              background: 'radial-gradient(circle at 50% 50%, #00C2FF 0%, transparent 70%)'
            }} />

            {/* Content wrapper */}
            <div className="relative p-6 flex items-center min-h-full">
              <div className="w-full space-y-5">
                <h3 className="text-2xl font-bold mb-6" style={{
                  color: '#80F1FF',
                  textShadow: '0 0 15px rgba(0, 194, 255, 0.6)'
                }}>
                  Interaction Growth Analytics
                </h3>

                {/* Current Status */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#00C2FF' }}>
                    <TrendingUp size={16} />
                    CURRENT STATUS
                  </h4>
                  <p className="text-base" style={{ color: '#C4C7E5' }}>
                    {getStatusMessage()}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="rounded-lg p-4" style={{
                  background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(26, 224, 182, 0.1) 100%)',
                  border: '1px solid rgba(0, 194, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 194, 255, 0.15)'
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#00C2FF' }}>
                        TOTAL INTERACTIONS
                      </p>
                      <p className="text-3xl font-bold" style={{
                        color: '#80F1FF',
                        textShadow: '0 0 10px rgba(0, 194, 255, 0.5)'
                      }}>
                        {stats?.totalInteractions || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#1AE0B6' }}>
                        GROWTH STAGE
                      </p>
                      <p className="text-3xl font-bold" style={{
                        color: '#80F1FF',
                        textShadow: '0 0 10px rgba(26, 224, 182, 0.5)'
                      }}>
                        {growthStage}/10
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-semibold" style={{ color: '#00C2FF' }}>
                      PROGRESS TO NEXT STAGE
                    </h4>
                    <span className="text-xs font-bold" style={{ color: '#80F1FF' }}>
                      {progressPercent}%
                    </span>
                  </div>

                  <div className="w-full rounded-full h-3 relative overflow-hidden" style={{
                    background: 'rgba(12, 27, 59, 0.8)',
                    border: '1px solid rgba(0, 194, 255, 0.3)',
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    {/* Animated gradient progress */}
                    <div
                      className="h-full rounded-full transition-all duration-500 relative"
                      style={{
                        background: 'linear-gradient(90deg, #00C2FF 0%, #1AE0B6 50%, #00C2FF 100%)',
                        width: `${progressPercent}%`,
                        boxShadow: '0 0 15px rgba(0, 194, 255, 0.8)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite'
                      }}
                    >
                      {/* Glow effect on progress bar */}
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite'
                      }} />
                    </div>
                  </div>

                  <p className="text-xs mt-2" style={{ color: '#AAB3D1' }}>
                    <span style={{ color: '#1AE0B6', fontWeight: 'bold' }}>{interactionsNeeded}</span> more interactions needed
                  </p>
                </div>

                {/* How it Works - HUD Style */}
                <div className="pt-4 mt-4" style={{
                  borderTop: '1px solid rgba(0, 194, 255, 0.2)'
                }}>
                  <h4 className="text-xs font-semibold mb-3 tracking-wider" style={{ color: '#00C2FF' }}>
                    SYSTEM MECHANICS
                  </h4>
                  <ul className="text-sm space-y-3">
                    <li className="flex items-start gap-3">
                      <Users size={18} style={{ color: '#00C2FF', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#C4C7E5' }}>
                        Each interaction contributes to growth progression
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Leaf size={18} style={{ color: '#1AE0B6', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#C4C7E5' }}>
                        Visual indicators emerge at key milestones
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Flower2 size={18} style={{ color: '#00C2FF', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#C4C7E5' }}>
                        Sustained engagement maintains optimal state
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Decorative vines with original green */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 600 500" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                {/* Green gradient for vines */}
                <linearGradient id="vineStalkGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#7CB342', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#558B2F', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Top edge vine */}
              <g opacity="0.85">
                {/* Black outline layer */}
                <path d="M 70 22 L 45 -5" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 150 12 L 162 -10" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 250 28 L 237 47" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 350 14 L 362 -7" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 450 22 L 437 43" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 550 10 L 562 -10" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path
                  d="M 0 15 C 80 25 120 5 200 20 C 280 35 320 10 400 18 C 480 26 520 5 600 15"
                  stroke="#000000"
                  strokeWidth="4.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Green vine layer on top */}
                <path d="M 70 22 L 45 -5" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="20" y="-20" width="42" height="42" transform="rotate(-90, 45, -5)" opacity="0.9" />

                <path d="M 150 12 L 162 -10" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="147" y="-25" width="40" height="40" transform="rotate(0, 162, -10)" opacity="0.9" />

                <path d="M 250 28 L 237 47" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="217" y="32" width="38" height="38" transform="rotate(180, 237, 47)" opacity="0.9" />

                <path d="M 350 14 L 362 -7" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="347" y="-22" width="42" height="42" transform="rotate(0, 362, -7)" opacity="0.9" />

                <path d="M 450 22 L 437 43" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="417" y="28" width="40" height="40" transform="rotate(180, 437, 43)" opacity="0.9" />

                <path d="M 550 10 L 562 -10" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="547" y="-25" width="42" height="42" transform="rotate(0, 562, -10)" opacity="0.9" />

                <path
                  d="M 0 15 C 80 25 120 5 200 20 C 280 35 320 10 400 18 C 480 26 520 5 600 15"
                  stroke="url(#vineStalkGradientGreen)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>

              {/* Bottom edge vine */}
              <g opacity="0.85">
                {/* Black outline layer */}
                <path d="M 70 478 L 45 505" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 150 488 L 157 502" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 250 472 L 240 455" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 350 486 L 357 500" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 450 478 L 440 460" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path d="M 550 490 L 557 503" stroke="#000000" strokeWidth="3.5" fill="none" />
                <path
                  d="M 0 485 C 80 475 120 495 200 480 C 280 465 320 490 400 482 C 480 474 520 495 600 485"
                  stroke="#000000"
                  strokeWidth="4.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Green vine layer on top */}
                <path d="M 70 478 L 45 505" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="20" y="490" width="42" height="42" transform="rotate(180, 45, 505)" opacity="0.9" />

                <path d="M 150 488 L 157 502" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="142" y="487" width="40" height="40" transform="rotate(90, 157, 502)" opacity="0.9" />

                <path d="M 250 472 L 240 455" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="220" y="440" width="38" height="38" transform="rotate(-90, 240, 455)" opacity="0.9" />

                <path d="M 350 486 L 357 500" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="342" y="485" width="42" height="42" transform="rotate(90, 357, 500)" opacity="0.9" />

                <path d="M 450 478 L 440 460" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="420" y="445" width="40" height="40" transform="rotate(-90, 440, 460)" opacity="0.9" />

                <path d="M 550 490 L 557 503" stroke="url(#vineStalkGradientGreen)" strokeWidth="2" fill="none" />
                <image href="/leaf.png" x="542" y="488" width="42" height="42" transform="rotate(90, 557, 503)" opacity="0.9" />

                <path
                  d="M 0 485 C 80 475 120 495 200 480 C 280 465 320 490 400 482 C 480 474 520 495 600 485"
                  stroke="url(#vineStalkGradientGreen)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {/* Right side - Plant visualization with dark theme */}
          <div className="relative rounded-xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(12, 27, 59, 0.9) 0%, rgba(18, 43, 89, 0.8) 100%)',
            border: '2px solid rgba(0, 194, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 194, 255, 0.2), inset 0 0 30px rgba(0, 194, 255, 0.03)'
          }}>
            {/* Dark vignette effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(12, 27, 59, 0.7) 100%)'
            }} />

            <svg
              viewBox="0 -50 800 750"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              style={{ display: 'block' }}
            >
              <defs>
                {/* Dark navy background gradient */}
                <linearGradient id="darkBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0C1B3B', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#122B59', stopOpacity: 1 }} />
                </linearGradient>

                {/* Night window with cyan glow */}
                <radialGradient id="nightWindowGlow" cx="30%" cy="20%">
                  <stop offset="0%" style={{ stopColor: '#00C2FF', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#1AE0B6', stopOpacity: 0.15 }} />
                  <stop offset="100%" style={{ stopColor: '#0C1B3B', stopOpacity: 0 }} />
                </radialGradient>

                {/* Windowsill - darker tone */}
                <linearGradient id="darkWindowsillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#1A2D4A', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0F1F35', stopOpacity: 1 }} />
                </linearGradient>

                {/* Cool shadow with blue tint */}
                <radialGradient id="coolShadowGradient" cx="50%" cy="50%">
                  <stop offset="0%" style={{ stopColor: '#00FFFF', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 0 }} />
                </radialGradient>

                {/* Pot gradient - brighter terracotta/brown */}
                <linearGradient id="darkPotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8B6F47', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#6B4423', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#5A3A1F', stopOpacity: 1 }} />
                </linearGradient>

                {/* Soil gradient - very dark */}
                <radialGradient id="darkSoilGradient" cx="50%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#1A2634', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0F1821', stopOpacity: 1 }} />
                </radialGradient>

                {/* Stalk gradient - original green colors */}
                <linearGradient id="stalkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#7CB342', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#558B2F', stopOpacity: 1 }} />
                </linearGradient>

                {/* Daytime sky gradient for window with cool tones */}
                <linearGradient id="daySkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#B0E0E6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#E0F6FF', stopOpacity: 1 }} />
                </linearGradient>

                {/* Sun glow - warm yellow */}
                <radialGradient id="sunGlow" cx="50%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#FFFACD', stopOpacity: 0.9 }} />
                  <stop offset="20%" style={{ stopColor: '#FFEB3B', stopOpacity: 0.7 }} />
                  <stop offset="50%" style={{ stopColor: '#FFD54F', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: '#FFF59D', stopOpacity: 0 }} />
                </radialGradient>

                {/* Faded sunset gradient overlay */}
                <linearGradient id="sunsetOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFB6A3', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#FFA896', stopOpacity: 0.25 }} />
                  <stop offset="100%" style={{ stopColor: '#FFD6BA', stopOpacity: 0.2 }} />
                </linearGradient>

                {/* Warm ambient room light */}
                <radialGradient id="warmRoomLight" cx="50%" cy="50%">
                  <stop offset="0%" style={{ stopColor: '#FFF9E6', stopOpacity: 0.25 }} />
                  <stop offset="50%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.12 }} />
                  <stop offset="100%" style={{ stopColor: '#FFD6A5', stopOpacity: 0 }} />
                </radialGradient>

                {/* Faded sun glow for sunset effect */}
                <radialGradient id="fadedSunGlow" cx="50%" cy="80%">
                  <stop offset="0%" style={{ stopColor: '#FFF4E0', stopOpacity: 0.5 }} />
                  <stop offset="30%" style={{ stopColor: '#FFE4B5', stopOpacity: 0.3 }} />
                  <stop offset="60%" style={{ stopColor: '#FFD700', stopOpacity: 0.15 }} />
                  <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 0 }} />
                </radialGradient>

                {/* Blue/green directional light from upper right - diagonal gradient */}
                <linearGradient id="blueGreenLight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00E0B8', stopOpacity: 0.45 }} />
                  <stop offset="25%" style={{ stopColor: '#00C2FF', stopOpacity: 0.35 }} />
                  <stop offset="50%" style={{ stopColor: '#1AE0B6', stopOpacity: 0.2 }} />
                  <stop offset="75%" style={{ stopColor: '#00C2FF', stopOpacity: 0.08 }} />
                  <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                </linearGradient>

                {/* Highlight gradient for pot rim (catching blue-green light) */}
                <linearGradient id="potRimHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#5A3A1F', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#8B6F47', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#A0957A', stopOpacity: 1 }} />
                </linearGradient>

                {/* Stone gradients - darker */}
                <linearGradient id="darkStone1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3A4A5F', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#2A3A4F', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Dark navy background */}
              <rect x="0" y="-50" width="800" height="750" fill="url(#darkBgGradient)" />

              {/* Warm ambient room lighting */}
              <ellipse cx="400" cy="300" rx="500" ry="400" fill="url(#warmRoomLight)" />

              {/* Blue/green directional light overlay from upper right corner - fades diagonally */}
              <rect x="0" y="-50" width="800" height="750" fill="url(#blueGreenLight)" style={{ mixBlendMode: 'screen' }} opacity="0.8" />

              {/* Daytime window with faded sunset tones */}
              <rect x="40" y="10" width="270" height="320" fill="url(#daySkyGradient)" stroke="#1A3A5A" strokeWidth="10" rx="5" />

              {/* Faded sunset overlay on window */}
              <rect x="40" y="10" width="270" height="320" fill="url(#sunsetOverlay)" rx="5" />

              {/* Faded sun at bottom (sunset position) */}
              <ellipse cx="175" cy="270" rx="110" ry="110" fill="url(#fadedSunGlow)" />
              <circle cx="175" cy="270" r="38" fill="#FFF4E0" opacity="0.4" />
              <circle cx="175" cy="270" r="30" fill="#FFE4B5" opacity="0.5" />

              {/* Soft clouds with warm tint */}
              <ellipse cx="80" cy="80" rx="30" ry="18" fill="rgba(255, 240, 230, 0.6)" />
              <ellipse cx="100" cy="75" rx="25" ry="15" fill="rgba(255, 240, 230, 0.5)" />
              <ellipse cx="250" cy="200" rx="35" ry="20" fill="rgba(255, 240, 230, 0.6)" />
              <ellipse cx="275" cy="195" rx="28" ry="16" fill="rgba(255, 240, 230, 0.5)" />
              <ellipse cx="120" cy="100" rx="25" ry="14" fill="rgba(255, 240, 230, 0.55)" />
              <ellipse cx="140" cy="97" rx="20" ry="12" fill="rgba(255, 240, 230, 0.45)" />

              {/* Window panes */}
              <line x1="175" y1="20" x2="175" y2="320" stroke="#1A3A5A" strokeWidth="6" />
              <line x1="50" y1="170" x2="300" y2="170" stroke="#1A3A5A" strokeWidth="6" />

              {/* Window glass reflection with cyan tint */}
              <rect x="60" y="30" width="100" height="130" fill="rgba(0, 194, 255, 0.05)" />
              <rect x="185" y="30" width="100" height="130" fill="rgba(0, 194, 255, 0.03)" />

              {/* Windowsill - darker */}
              <rect x="30" y="330" width="330" height="15" fill="url(#darkWindowsillGradient)" stroke="#1A3A5A" strokeWidth="2" />
              <rect x="25" y="345" width="340" height="8" fill="#1A2D4A" stroke="#0F1F35" strokeWidth="2" />

              {/* Surface the pot sits on */}
              <rect x="100" y="630" width="600" height="25" fill="url(#darkWindowsillGradient)" stroke="#1A3A5A" strokeWidth="3" rx="2" />

              {/* Cool shadow under pot with cyan tint */}
              <ellipse cx="400" cy="645" rx="140" ry="15" fill="url(#coolShadowGradient)" />
              <ellipse cx="400" cy="632" rx="80" ry="8" fill="rgba(0, 255, 255, 0.05)" />

              {/* Pot - brighter terracotta */}
              <path
                d="M 220 500 L 250 630 L 550 630 L 580 500 Z"
                fill="url(#darkPotGradient)"
                stroke="#000000"
                strokeWidth="3"
              />

              {/* Pot Rim with highlight from directional light */}
              <ellipse cx="400" cy="500" rx="180" ry="25" fill="url(#potRimHighlight)" stroke="#000000" strokeWidth="3" />

              {/* Blue-green light catch on right side of pot rim */}
              <ellipse cx="480" cy="498" rx="60" ry="12" fill="rgba(0, 224, 184, 0.15)" opacity="0.8" />

              {/* Soil - very dark */}
              <ellipse cx="400" cy="500" rx="165" ry="22" fill="url(#darkSoilGradient)" />

              {/* Pebbles - natural look */}
              <ellipse cx="270" cy="502" rx="5" ry="4" fill="url(#darkStone1)" stroke="#3A4A5F" strokeWidth="1.5" opacity="0.8" />
              <ellipse cx="290" cy="508" rx="4" ry="3" fill="url(#darkStone1)" stroke="#3A4A5F" strokeWidth="1.5" opacity="0.8" />
              <ellipse cx="530" cy="503" rx="5" ry="4" fill="url(#darkStone1)" stroke="#3A4A5F" strokeWidth="1.5" opacity="0.8" />
              <ellipse cx="510" cy="507" rx="4" ry="3" fill="url(#darkStone1)" stroke="#3A4A5F" strokeWidth="1.5" opacity="0.8" />

              {/* Main Stalk - original green colors */}
              <rect
                x="392"
                y="80"
                width="16"
                height="420"
                fill="url(#stalkGradient)"
                rx="8"
                stroke="#000000"
                strokeWidth="2"
              />

              {/* Blue-green light highlight on right edge of stalk */}
              <rect
                x="404"
                y="80"
                width="4"
                height="420"
                fill="rgba(0, 224, 184, 0.2)"
                rx="2"
                opacity="0.7"
              />

              {/* Daisy flower - brighter and more vibrant */}
              {hasFlower && (
                <>
                  <image
                    href="/daisy-flower.png"
                    x="300"
                    y="-40"
                    width="200"
                    height="200"
                    opacity="1"
                    style={{ filter: 'saturate(1.1) brightness(1.15)' }}
                  />
                  {/* Blue-green light tint on right side of flower */}
                  <ellipse cx="450" cy="40" rx="50" ry="60" fill="rgba(0, 224, 184, 0.12)" opacity="0.7" />
                </>
              )}

              {/* Leaves - original green colors with directional light tint */}
              {leaves.map((leaf) => {
                // Calculate if leaf is on the right side (catching more blue-green light)
                const isRightSide = leaf.side === 'right';
                const lightIntensity = isRightSide ? 0.15 : 0.08;

                return (
                  <g key={`leaf-group-${leaf.id}`}>
                    <path
                      d={`M ${leaf.stemX} ${leaf.stemY} L ${leaf.x} ${leaf.y}`}
                      stroke="url(#stalkGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <image
                      href="/leaf.png"
                      x={leaf.x - 30}
                      y={leaf.y - 30}
                      width="60"
                      height="60"
                      transform={leaf.flipX ? `scale(-1, 1) translate(${-2 * leaf.x}, 0)` : ''}
                      opacity="0.95"
                    />
                    {/* Blue-green light tint on leaves, stronger on right side */}
                    {isRightSide && (
                      <ellipse
                        cx={leaf.x + 10}
                        cy={leaf.y}
                        rx="25"
                        ry="20"
                        fill={`rgba(0, 224, 184, ${lightIntensity})`}
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}

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
                    fill="#7CB342"
                    stroke="#558B2F"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default PottedPlantVisualization;
