import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import PottedPlantVisualization from '../StudentAnalytics/PottedPlantVisualization';
import { TrendingUp, Zap, Award, Target } from 'lucide-react';

/**
 * StudentProfile (Regenerated)
 * - Layout matches the provided image exactly (no sidebar).
 * - Left: large avatar/video area. Right: stacked performance tiles.
 * - Uses original media/video logic and buildMediaUrl behavior.
 * - Visuals use the palette you supplied.
 *
 * Replace your existing StudentProfile with this file. It keeps original logic intact.
 */

/* ---------- Palette (from your provided hex codes) ---------- */
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

const MEDIA_THEME = 'green';

const StudentProfile = () => {
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

  // --- media base logic (same as original) ---
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
    if (!studentPrefix || studentPrefix === 'default') {
      return 'Student';
    }
    return `Student ${studentPrefix}`;
  }, [studentPrefix]);

  // --- original media/video logic preserved ---
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
      // ignore pause issues
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
      // ignore reset issues
    }

    if (autoplay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const loopSuffix = useMemo(() => `${MEDIA_THEME}_loop.mp4`, []);
  const waveSuffix = useMemo(() => `${MEDIA_THEME}_wave.mp4`, []);
  const straightPoster = useMemo(() => `${MEDIA_THEME}_straight.jpg`, []);

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
          // ignore pause errors
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

  // Fetch dashboard data for plant visualization
  useEffect(() => {
    if (currentStudentId) {
      const data = getDashboardData();
      setDashboardData(data);
    }
  }, [currentStudentId, getDashboardData]);

  // tiles with visual props
  const tiles = useMemo(() => [
    { 
      id: 'tl', 
      label: 'Engagement', 
      status: 'GOOD', 
      mediaSuffix: `${MEDIA_THEME}_top-left.jpg`, 
      icon: TrendingUp, 
      gradient: 'from-engagement-icon-start to-engagement-icon-end', 
      bgGradient: 'from-primary-bg-start/30 to-primary-bg-end/30', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'bl', 
      label: 'Interactivity', 
      status: 'GOOD', 
      mediaSuffix: `${MEDIA_THEME}_bottom-left.jpg`, 
      icon: Zap, 
      gradient: 'from-interactivity-icon-start to-interactivity-icon-end', 
      bgGradient: 'from-primary-bg-start/30 to-primary-bg-end/30', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'tr', 
      label: 'Academic Performance', 
      status: 'GOOD', 
      mediaSuffix: `${MEDIA_THEME}_top-right.jpg`, 
      icon: Award, 
      gradient: 'from-academic-icon-start to-academic-icon-end', 
      bgGradient: 'from-primary-bg-start/30 to-primary-bg-end/30', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    },
    { 
      id: 'br', 
      label: 'Overall Performance', 
      status: 'GOOD', 
      mediaSuffix: `${MEDIA_THEME}_bottom-right.jpg`, 
      icon: Target, 
      gradient: 'from-card-accent-start to-card-accent-end', 
      bgGradient: 'from-primary-bg-start/30 to-primary-bg-end/30', 
      textColor: 'text-primary-text', 
      borderColor: 'border-card-accent-end/50' 
    }
  ], []);

  const renderTile = (tile) => {
    const Icon = tile.icon;

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
        <div className={`relative bg-gradient-to-br ${tile.bgGradient} rounded-xl p-4 border ${tile.borderColor} shadow-lg hover:shadow-xl hover:shadow-card-accent-end/30 transition-all duration-300 h-full flex flex-col justify-center`}>
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tile.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          <div className="relative flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${tile.gradient} shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${tile.textColor} mb-0.5`}>{tile.label}</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-good-status-dot animate-pulse shadow-lg" />
                <span className="text-xs text-good-text-label font-semibold">{tile.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-bg-start to-primary-bg-end p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-bg-start/30 to-primary-bg-end/30 rounded-xl p-6 border border-card-accent-end/50 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-card-accent-end/50 rounded-full blur-3xl opacity-30" />
            <div className="relative">
              <h1 className="text-3xl font-bold text-title-text mb-2">Welcome {displayName}</h1>
              <p className="text-sm text-secondary-text">Your Digital Twin Learning Profile</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column - First Two Tiles */}
            <div className="space-y-6 flex flex-col">
              {tiles.slice(0, 2).map((tile) => (
                <div key={tile.id} className="flex-1">
                  {renderTile(tile)}
                </div>
              ))}
            </div>

            {/* Center - Video/Image Display */}
            <div 
              className="relative overflow-hidden bg-gradient-to-br from-primary-bg-start/30 to-primary-bg-end/30 rounded-xl border border-card-accent-end/50 shadow-lg cursor-pointer transition-all duration-300 hover:border-card-accent-end/70 hover:shadow-xl hover:shadow-card-accent-end/30"
              onMouseEnter={handleCenterMouseEnter}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-card-accent-start to-card-accent-end rounded-full blur-3xl opacity-20" />
              <div className="relative aspect-[3/4] flex items-center justify-center p-4">
                <video
                  id="heroVideo"
                  ref={heroVideoRef}
                  className="w-full h-full object-cover rounded-lg"
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
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Right Column - Last Two Tiles */}
            <div className="space-y-6 flex flex-col">
              {tiles.slice(2).map((tile) => (
                <div key={tile.id} className="flex-1">
                  {renderTile(tile)}
                </div>
              ))}
            </div>
          </div>

          {/* Potted Plant Visualization Section */}
          {dashboardData?.recentInteractions && (
            <div className="mt-8">
              <PottedPlantVisualization
                stats={dashboardData.recentInteractions}
                showHeading={true}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;