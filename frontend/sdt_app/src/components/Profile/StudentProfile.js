import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import PottedPlantVisualization from '../StudentAnalytics/PottedPlantVisualization';
import { TrendingUp, Zap, Award, Target } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getCardStyles, getTextStyles } from '../../utils/themeStyles';

/**
 * StudentProfile with Color-Coded Performance
 * - Green: Pass (Good performance)
 * - Orange: Pass (Warning - some issues)
 * - Red: Fail (Poor performance)
 */

/* ---------- Palette ---------- */
const PALETTE = {
  primaryA: '#0B0E26',
  primaryB: '#1A1B4B',
  sidebarA: '#8A5CFB',
  sidebarB: '#4B3CFA',
  cardBg: '#1E2246',
  accentA: '#00B8D9',
  accentB: '#36E0F8',
  title: '#66E3FF',
  headerTitleAlt: '#80F1FF',
  subtitle: '#C4C7E5',
  body: '#E6E6F0',
  secondary: '#AAB3D1',
  avatarFrame: '#15193A',
  statusDot: '#00E0B8',
  goodLabel: '#C7FFF6',
  viewLink: '#36E0F8'
};

// Hard-coded student performance data
const STUDENT_PROFILES = {
  '38925958': {
    name: 'Michael',
    theme: 'green',
    overallStatus: 'PASS',
    overallStatusColor: 'text-green-400',
    statusDotColor: 'bg-green-400',
    metrics: {
      engagement: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' },
      interactivity: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' },
      academic: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' }
    }
  },
  '41425626': {
    name: 'Zai',
    theme: 'red',
    overallStatus: 'FAIL',
    overallStatusColor: 'text-red-400',
    statusDotColor: 'bg-red-400',
    metrics: {
      engagement: { status: 'LOW', statusColor: 'text-red-400', dotColor: 'bg-red-400' },
      interactivity: { status: 'TOO LOW', statusColor: 'text-red-400', dotColor: 'bg-red-400' },
      academic: { status: 'LOW', statusColor: 'text-red-400', dotColor: 'bg-red-400' }
    }
  },
  '40954129': {
    name: 'Stefan',
    theme: 'red',
    overallStatus: 'FAIL',
    overallStatusColor: 'text-red-400',
    statusDotColor: 'bg-red-400',
    metrics: {
      engagement: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' },
      interactivity: { status: 'TOO LOW', statusColor: 'text-red-400', dotColor: 'bg-red-400' },
      academic: { status: 'LOW', statusColor: 'text-red-400', dotColor: 'bg-red-400' }
    }
  },
  '40977676': {
    name: 'Maderi',
    theme: 'orange',
    overallStatus: 'PASS',
    overallStatusColor: 'text-orange-400',
    statusDotColor: 'bg-orange-400',
    metrics: {
      engagement: { status: 'TOO LOW', statusColor: 'text-orange-400', dotColor: 'bg-orange-400' },
      interactivity: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' },
      academic: { status: 'GOOD', statusColor: 'text-green-400', dotColor: 'bg-green-400' }
    }
  }
};

const StudentProfile = () => {
  // --- Theme context ---
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const cardStyles = useMemo(() => getCardStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const textStyles = useMemo(() => getTextStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);

  // --- keep original hook usage and id handling ---
  const { currentStudentId } = useStudentData();
  const { getDashboardData } = useInteractionSimulator(currentStudentId);
  const [dashboardData, setDashboardData] = useState(null);

  const studentPrefix = useMemo(() => {
    if (currentStudentId === undefined || currentStudentId === null) {
      return 'default';
    }
    try {
      return String(currentStudentId).trim() || 'default';
    } catch (error) {
      return 'default';
    }
  }, [currentStudentId]);

  // Get student profile data
  const studentProfile = useMemo(() => {
    return STUDENT_PROFILES[studentPrefix] || {
      name: 'Student',
      theme: 'green',
      overallStatus: 'UNKNOWN',
      overallStatusColor: 'text-gray-400',
      statusDotColor: 'bg-gray-400',
      metrics: {
        engagement: { status: 'N/A', statusColor: 'text-gray-400', dotColor: 'bg-gray-400' },
        interactivity: { status: 'N/A', statusColor: 'text-gray-400', dotColor: 'bg-gray-400' },
        academic: { status: 'N/A', statusColor: 'text-gray-400', dotColor: 'bg-gray-400' }
      }
    };
  }, [studentPrefix]);

  const mediaBase = useMemo(() => {
    const fallbackOrigin =
      typeof window !== 'undefined' && window.location
        ? window.location.origin
        : 'http://localhost:3000';
    const rawBase = process.env.REACT_APP_API_URL || fallbackOrigin || 'http://localhost:5000';
    try {
      const parsed = new URL(rawBase, fallbackOrigin);
      return `${parsed.origin}/avatars`;
    } catch (error) {
      return `${fallbackOrigin || 'http://localhost:5000'}/avatars`;
    }
  }, []);

  const buildFileName = useCallback(
    (suffix) => {
      if (!suffix) {
        return null;
      }
      return `${studentPrefix}_${suffix}`;
    },
    [studentPrefix]
  );

  const buildMediaUrl = useCallback(
    (suffix) => {
      const fileName = buildFileName(suffix);
      return fileName ? `${mediaBase}/${fileName}` : null;
    },
    [mediaBase, buildFileName]
  );

  const displayName = useMemo(() => {
    return studentProfile.name;
  }, [studentProfile]);

  // Video logic
  const heroVideoRef = useRef(null);
  const hoveringTileRef = useRef(false);
  const playingWaveRef = useRef(false);

  const [activeImageSrc, setActiveImageSrc] = useState(null);

  const setVideoSource = useCallback((src, { loop = false, autoplay = true } = {}) => {
    const video = heroVideoRef.current;
    if (!video || !src) {
      return;
    }

    const needsUpdate = video.src !== src;

    try {
      video.pause();
    } catch (error) {
      // ignore
    }

    if (needsUpdate) {
      video.removeAttribute('src');
      video.load();
      video.src = src;
    }

    video.loop = loop;
    try {
      video.currentTime = 0;
    } catch (error) {
      // ignore
    }

    if (autoplay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const loopSuffix = useMemo(() => `${studentProfile.theme}_loop.mp4`, [studentProfile.theme]);
  const waveSuffix = useMemo(() => `${studentProfile.theme}_wave.mp4`, [studentProfile.theme]);
  const straightPoster = useMemo(() => `${studentProfile.theme}_straight.jpg`, [studentProfile.theme]);

  const startLoop = useCallback(() => {
    if (hoveringTileRef.current) {
      return;
    }
    playingWaveRef.current = false;
    const loopUrl = buildMediaUrl(loopSuffix);
    if (loopUrl) {
      setVideoSource(loopUrl, { loop: true, autoplay: true });
    }
  }, [buildMediaUrl, loopSuffix, setVideoSource]);

  const playWaveThenLoop = useCallback(() => {
    hoveringTileRef.current = false;
    setActiveImageSrc(null);
    playingWaveRef.current = true;
    const waveUrl = buildMediaUrl(waveSuffix);
    if (waveUrl) {
      setVideoSource(waveUrl, { loop: false, autoplay: true });
    }
  }, [buildMediaUrl, waveSuffix, setVideoSource]);

  const showImage = useCallback(
    (suffix) => {
      hoveringTileRef.current = true;
      const video = heroVideoRef.current;
      if (video) {
        try {
          video.pause();
        } catch (error) {
          // ignore
        }
      }
      const url = buildMediaUrl(suffix);
      setActiveImageSrc(url);
    },
    [buildMediaUrl]
  );

  const hideImage = useCallback(() => {
    hoveringTileRef.current = false;
    setActiveImageSrc(null);
    startLoop();
  }, [startLoop]);

  const handleCenterMouseEnter = useCallback(() => {
    playWaveThenLoop();
  }, [playWaveThenLoop]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) {
      return undefined;
    }

    const handleEnded = () => {
      if (playingWaveRef.current && !hoveringTileRef.current) {
        startLoop();
      }
      playingWaveRef.current = false;
    };

    video.addEventListener('ended', handleEnded);
    playWaveThenLoop();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [playWaveThenLoop, startLoop]);

  useEffect(() => {
    setActiveImageSrc(null);
    playWaveThenLoop();
  }, [studentPrefix, playWaveThenLoop]);

  useEffect(() => {
    if (currentStudentId) {
      const data = getDashboardData();
      setDashboardData(data);
    }
  }, [currentStudentId, getDashboardData]);

  // Tiles with dynamic status from student profile
  const tiles = useMemo(() => [
    { 
      id: 'tl', 
      label: 'Engagement', 
      status: studentProfile.metrics.engagement.status,
      statusColor: studentProfile.metrics.engagement.statusColor,
      dotColor: studentProfile.metrics.engagement.dotColor,
      mediaSuffix: `${studentProfile.theme}_top-left.jpg`, 
      icon: TrendingUp, 
      gradient: 'from-engagement-icon-start to-engagement-icon-end', 
      bgGradient: 'from-card-bg/60 to-card-bg/60', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'bl', 
      label: 'Interactivity', 
      status: studentProfile.metrics.interactivity.status,
      statusColor: studentProfile.metrics.interactivity.statusColor,
      dotColor: studentProfile.metrics.interactivity.dotColor,
      mediaSuffix: `${studentProfile.theme}_bottom-left.jpg`, 
      icon: Zap, 
      gradient: 'from-interactivity-icon-start to-interactivity-icon-end', 
      bgGradient: 'from-card-bg/60 to-card-bg/60', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'tr', 
      label: 'Academic Performance', 
      status: studentProfile.metrics.academic.status,
      statusColor: studentProfile.metrics.academic.statusColor,
      dotColor: studentProfile.metrics.academic.dotColor,
      mediaSuffix: `${studentProfile.theme}_top-right.jpg`, 
      icon: Award, 
      gradient: 'from-academic-icon-start to-academic-icon-end', 
      bgGradient: 'from-card-bg/60 to-card-bg/60', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'br', 
      label: 'Overall Performance', 
      status: studentProfile.overallStatus,
      statusColor: studentProfile.overallStatusColor,
      dotColor: studentProfile.statusDotColor,
      mediaSuffix: `${studentProfile.theme}_bottom-right.jpg`, 
      icon: Target, 
      gradient: 'from-card-accent-start to-card-accent-end', 
      bgGradient: 'from-card-bg/60 to-card-bg/60', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    }
  ], [studentProfile]);

  const renderTile = (tile) => {
    const Icon = tile.icon;

    // Professional theme uses THEME.md colors based on tile type
    const getTileColor = () => {
      if (!isProfessional) return null;

      switch(tile.id) {
        case 'tl': return '#6C5CE7'; // Primary - Engagement
        case 'bl': return '#FFB020'; // Accent - Interactivity
        case 'tr': return '#3AA3FF'; // Info - Academic Performance
        case 'br': return '#2ECC71'; // Success - Overall Performance
        default: return '#6C5CE7';
      }
    };

    const tileColor = getTileColor();

    // Theme-aware tile styling
    const tileContainerClass = isKSGVariant
      ? `bg-gradient-to-br ${tile.bgGradient}`
      : isProfessional
      ? ''
      : `bg-gradient-to-br ${tile.bgGradient}`;

    const tileBorderClass = isKSGVariant
      ? `border ${tile.borderColor}`
      : isProfessional
      ? ''
      : `border ${tile.borderColor}`;

    const tileShadowClass = isKSGVariant
      ? 'shadow-lg hover:shadow-xl hover:shadow-card-accent-end/30'
      : isProfessional
      ? ''
      : 'shadow-lg hover:shadow-xl hover:shadow-card-accent-end/30';

    const tileRoundingClass = isProfessional ? 'rounded-[14px]' : 'rounded-xl';

    return (
      <div
        key={tile.id}
        className="relative overflow-hidden group cursor-pointer transition-all duration-300 h-full"
        onMouseEnter={() => showImage(tile.mediaSuffix)}
        onMouseLeave={hideImage}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImage(tile.mediaSuffix); }}
        aria-label={`${tile.label} preview`}
      >
        <div
          className={`relative ${tileContainerClass} ${tileRoundingClass} p-6 h-full flex flex-col justify-between min-h-[160px] ${isProfessional ? 'hover:scale-105 hover:-translate-y-1' : ''}`}
          style={isProfessional ? {
            backgroundColor: tileColor,
            boxShadow: '0 6px 14px rgba(31, 36, 48, 0.06)',
            transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)'
          } : {}}
        >
          {/* Large faded icon in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none">
            <Icon className={isProfessional ? "w-32 h-32 text-white" : "w-32 h-32 text-white"} />
          </div>

          {/* Background gradient blur effect for non-professional themes */}
          {!isProfessional && (
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tile.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          )}

          {/* Content - centered both vertically and horizontally */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 space-y-4">
            <div
              className="font-bold leading-tight"
              style={isProfessional ? {
                fontFamily: 'Inter, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#FFFFFF'
              } : {
                fontSize: '28px',
                color: tile.textColor
              }}
            >
              {tile.label}
            </div>
            <div
              className={isProfessional ? `font-bold ${tile.statusColor}` : "font-bold"}
              style={isProfessional ? {
                fontFamily: 'Inter, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                WebkitTextStroke: '2px white',
                paintOrder: 'stroke fill'
              } : {
                fontSize: '24px',
                color: tile.statusColor,
                WebkitTextStroke: '2px white',
                paintOrder: 'stroke fill'
              }}
            >
              {tile.status}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className={isKSGVariant
        ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
        : isProfessional
        ? 'bg-white rounded-lg shadow-pro-card border border-gray-200 p-6 mt-6'
        : 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
      }>
        {!isProfessional && (
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
            <div className="relative">
              <h1 className="text-3xl font-bold text-title-text mb-2">Welcome {displayName}</h1>
              <p className="text-sm text-secondary-text">Your Digital Twin Learning Profile</p>
            </div>
          </div>
        )}
        {isProfessional && (
          <div className="relative">
            <h1 className="text-3xl font-bold text-pro-text mb-2">Welcome {displayName}</h1>
            <p className="text-sm text-pro-text-muted">Your Digital Twin Learning Profile</p>
          </div>
        )}
      </div>

      {/* Main Grid Container */}
      <div className={isKSGVariant
        ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
        : isProfessional
        ? 'bg-white rounded-lg shadow-pro-card border border-gray-200 p-6 mt-6'
        : 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
      }>
        {!isProfessional && (
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Left Column - First Two Tiles */}
              <div className="space-y-8 flex flex-col">
                {tiles.slice(0, 2).map((tile) => (
                  <div key={tile.id} className="flex-1 p-2">
                    {renderTile(tile)}
                  </div>
                ))}
              </div>

              {/* Center - Video/Image Display */}
              <div
                className="relative aspect-[3/4] bg-avatar-frame rounded-lg overflow-hidden"
                onMouseEnter={handleCenterMouseEnter}
              >
                <video
                  id="heroVideo"
                  ref={heroVideoRef}
                  className="absolute inset-0 w-full h-full object-contain"
                  playsInline
                  muted
                  preload="auto"
                  style={{ display: activeImageSrc ? 'none' : 'block' }}
                  poster={buildMediaUrl(straightPoster) || undefined}
                />
                {activeImageSrc && (
                  <img
                    src={activeImageSrc}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Right Column - Last Two Tiles */}
              <div className="space-y-8 flex flex-col">
                {tiles.slice(2).map((tile) => (
                  <div key={tile.id} className="flex-1 p-2">
                    {renderTile(tile)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {isProfessional && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Column - First Two Tiles */}
            <div className="space-y-8 flex flex-col">
              {tiles.slice(0, 2).map((tile) => (
                <div key={tile.id} className="flex-1 p-2">
                  {renderTile(tile)}
                </div>
              ))}
            </div>

            {/* Center - Video/Image Display */}
            <div
              className="relative aspect-[3/4] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
              onMouseEnter={handleCenterMouseEnter}
            >
              <video
                id="heroVideo"
                ref={heroVideoRef}
                className="absolute inset-0 w-full h-full object-contain"
                playsInline
                muted
                preload="auto"
                style={{ display: activeImageSrc ? 'none' : 'block' }}
                poster={buildMediaUrl(straightPoster) || undefined}
              />
              {activeImageSrc && (
                <img
                  src={activeImageSrc}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
            </div>

            {/* Right Column - Last Two Tiles */}
            <div className="space-y-8 flex flex-col">
              {tiles.slice(2).map((tile) => (
                <div key={tile.id} className="flex-1 p-2">
                  {renderTile(tile)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {dashboardData?.recentInteractions && (
        <div className={isKSGVariant
          ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
          : isProfessional
          ? 'bg-white rounded-lg shadow-pro-card border border-gray-200 p-6 mt-6'
          : 'bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 mt-6'
        }>
          {!isProfessional && (
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <PottedPlantVisualization
                stats={dashboardData.recentInteractions}
                showHeading={true}
              />
            </div>
          )}
          {isProfessional && (
            <PottedPlantVisualization
              stats={dashboardData.recentInteractions}
              showHeading={true}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default StudentProfile;