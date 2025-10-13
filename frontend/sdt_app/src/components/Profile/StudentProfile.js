import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';
import { TrendingUp, Zap, Award, Target, X } from 'lucide-react';

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

const detailsData = {
  tl: {
    title: 'Engagement',
    status: 'GOOD',
    score: 82,
    lastActivity: '2025-10-10',
    participation: 78,
    notes:
      'Student shows consistent daily engagement with interactive modules and discussion boards. Consider nudging toward deeper reflections in the forum posts to further raise engagement quality.',
    highlights: [
      'Average session: 22m',
      'Active days this month: 18 / 30',
      'Top activity: Live Q&A participation'
    ]
  },
  bl: {
    title: 'Interactivity',
    status: 'GOOD',
    score: 76,
    lastActivity: '2025-10-11',
    participation: 72,
    notes: 'Responds well to peer prompts and group work. Could benefit from more initiated discussions rather than replies.',
    highlights: [
      'Group projects completed: 3',
      'Average replies per thread: 4',
      'Live sessions joined: 5'
    ]
  },
  tr: {
    title: 'Academic Performance',
    status: 'GOOD',
    score: 88,
    lastActivity: '2025-10-09',
    participation: 85,
    notes: 'Strong assessment results, particularly in applied assignments. Recommend adding stretch tasks to prepare for advanced topics.',
    highlights: [
      'Average grade: 88%',
      'Assignments on time: 95%',
      'Top subject: Data Structures'
    ]
  },
  br: {
    title: 'Overall Performance',
    status: 'GOOD',
    score: 84,
    lastActivity: '2025-10-12',
    participation: 80,
    notes: 'Solid overall performance. Balanced profile across engagement and assessments. Opportunity to increase challenge level for growth.',
    highlights: [
      'Composite index: 84',
      'Growth last month: +3%',
      'Recommendations: Stretch tasks, targeted feedback'
    ]
  }
};

const StudentProfile = () => {
  // --- keep original hook usage and id handling ---
  const { currentStudentId } = useStudentData();

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
  const [openDetailsId, setOpenDetailsId] = useState(null);

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

  // tiles with visual props (kept from original)
  const tiles = useMemo(() => [
    { id: 'tl', label: 'Engagement', status: 'GOOD', mediaSuffix: `${MEDIA_THEME}_top-left.jpg`, icon: TrendingUp, gradient: 'linear-gradient(135deg,#0099CC,#00E0FF)', bgGradient: 'rgba(0,0,0,0.2)', textColor: PALETTE.title },
    { id: 'bl', label: 'Interactivity', status: 'GOOD', mediaSuffix: `${MEDIA_THEME}_bottom-left.jpg`, icon: Zap, gradient: 'linear-gradient(135deg,#00C4CC,#7B68EE)', bgGradient: 'rgba(0,0,0,0.2)', textColor: PALETTE.title },
    { id: 'tr', label: 'Academic Performance', status: 'GOOD', mediaSuffix: `${MEDIA_THEME}_top-right.jpg`, icon: Award, gradient: 'linear-gradient(135deg,#00D2B8,#33E0E0)', bgGradient: 'rgba(0,0,0,0.2)', textColor: PALETTE.title },
    { id: 'br', label: 'Overall Performance', status: 'GOOD', mediaSuffix: `${MEDIA_THEME}_bottom-right.jpg`, icon: Target, gradient: 'linear-gradient(135deg,#0099CC,#00E0FF)', bgGradient: 'rgba(0,0,0,0.2)', textColor: PALETTE.title }
  ], []);

  const openDetails = useCallback((id) => {
    setOpenDetailsId(id);
    const entry = tiles.find(t => t.id === id);
    if (entry) showImage(entry.mediaSuffix);
  }, [tiles, showImage]);

  const closeDetails = useCallback(() => {
    setOpenDetailsId(null);
    hideImage();
  }, [hideImage]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetails();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDetails]);

  const renderTile = (tile) => {
    const Icon = tile.icon;
    const isOpen = openDetailsId === tile.id;

    return (
      <div
        key={tile.id}
        className={`relative overflow-hidden group cursor-pointer transition-all duration-200 ${isOpen ? 'scale-102' : ''}`}
        onMouseEnter={() => showImage(tile.mediaSuffix)}
        onMouseLeave={hideImage}
        onClick={() => openDetails(tile.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDetails(tile.id); }}
        aria-pressed={isOpen}
        aria-label={`${tile.label} details`}
        style={{
          background: PALETTE.cardBg,
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div style={{ width:54, height:54, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background: tile.gradient, boxShadow: '0 6px 18px rgba(0,0,0,0.45)' }}>
          <Icon className="w-5 h-5" style={{ color: '#fff' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: tile.textColor, fontSize: 18 }}>{tile.label}</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
            <span style={{ width:10, height:10, borderRadius:999, background: PALETTE.statusDot, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
            <span style={{ color: PALETTE.goodLabel, fontWeight:700, fontSize:12 }}>{tile.status}</span>
          </div>
        </div>

        <div style={{ color: PALETTE.viewLink, fontWeight:700 }}>View</div>
      </div>
    );
  };

  // --- layout: no sidebar; main container purple gradient; left avatar; right stacked tiles ---
  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        padding: 28,
        background: `linear-gradient(180deg, ${PALETTE.primaryA}, ${PALETTE.primaryB})`,
        color: PALETTE.body
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Header bar */}
          <div style={{
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(10,12,35,0.55), rgba(26,27,75,0.40))',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.02)'
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: PALETTE.headerTitleAlt }}>Welcome {displayName}</h1>
              <div style={{ marginTop: 6, color: PALETTE.subtitle }}>Your Digital Twin Learning Profile</div>
            </div>
          </div>

          {/* Main split: left avatar, right stacked tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '560px 1fr', gap: 24, alignItems: 'start' }}>

            {/* LEFT: Avatar / video container (priority 1) */}
            <div
              className="avatar-container"
              style={{
                background: `linear-gradient(180deg, rgba(10,12,35,0.6), rgba(8,10,30,0.85))`,
                borderRadius: 18,
                padding: 20,
                boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.02)',
                height: 720,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={handleCenterMouseEnter}
            >
              <div style={{
                width: 440,
                height: 640,
                borderRadius: 18,
                background: PALETTE.avatarFrame,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 18,
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)'
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#0b0e1f' }}>
                  <video
                    ref={heroVideoRef}
                    className="hero-video"
                    playsInline
                    muted
                    preload="auto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: activeImageSrc ? 'none' : 'block' }}
                    poster={buildMediaUrl(straightPoster) || undefined}
                  />
                  {activeImageSrc && (
                    <img
                      src={activeImageSrc}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Stacked tiles (priority 2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {tiles.map(renderTile)}
            </div>

          </div>
        </div>

        {/* Details slide-over (keeps original details panel behavior and content) */}
        {openDetailsId && (
          <div style={{
            position: 'fixed',
            right: 28,
            top: 80,
            width: 420,
            height: '72vh',
            background: 'linear-gradient(180deg, rgba(7,9,28,0.95), rgba(12,13,30,0.98))',
            borderRadius: 14,
            padding: 20,
            boxShadow: '0 18px 60px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.02)',
            zIndex: 60
          }} role="dialog" aria-label="Details slide over">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7B68EE,#00C4CC)' }}>
                  {(() => {
                    const icon = tiles.find(t => t.id === openDetailsId)?.icon || TrendingUp;
                    const Icon = icon;
                    return <Icon className="w-6 h-6" style={{ color: '#fff' }} />;
                  })()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontWeight: 800 }}>{detailsData[openDetailsId]?.title || 'Details'}</h3>
                  <div style={{ fontSize: 12, color: PALETTE.secondary }}>Status: <span style={{ color: PALETTE.statusDot, fontWeight: 800, marginLeft: 8 }}>{detailsData[openDetailsId]?.status}</span></div>
                </div>
              </div>

              <button
                onClick={closeDetails}
                aria-label="Close panel"
                style={{ background: 'transparent', border: 'none', color: PALETTE.body, cursor: 'pointer' }}
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: PALETTE.secondary, marginBottom: 8 }}>Last activity: {detailsData[openDetailsId]?.lastActivity}</div>

              {/* Score */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: PALETTE.body, fontWeight: 800 }}>Score</div>
                  <div style={{ color: PALETTE.secondary }}>{detailsData[openDetailsId]?.score}%</div>
                </div>
                <div style={{ marginTop: 8, height: 10, background: '#0b0e1f', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${detailsData[openDetailsId]?.score}%`, height: '100%', background: `linear-gradient(90deg, ${PALETTE.accentA}, ${PALETTE.accentB})` }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#0b0e1f', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: PALETTE.secondary }}>Participation</div>
                  <div style={{ fontWeight: 800 }}>{detailsData[openDetailsId]?.participation}%</div>
                </div>
                <div style={{ background: '#0b0e1f', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: PALETTE.secondary }}>Composite</div>
                  <div style={{ fontWeight: 800 }}>{detailsData[openDetailsId]?.score}</div>
                </div>
                <div style={{ background: '#0b0e1f', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: PALETTE.secondary }}>Updated</div>
                  <div style={{ fontWeight: 800 }}>{detailsData[openDetailsId]?.lastActivity}</div>
                </div>
              </div>

              <div style={{ color: PALETTE.body, marginBottom: 12 }}>{detailsData[openDetailsId]?.notes}</div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: PALETTE.body, marginBottom: 8 }}>Highlights</div>
                <ul style={{ marginLeft: 16, color: PALETTE.body }}>
                  {(detailsData[openDetailsId]?.highlights || []).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, background: `linear-gradient(90deg,#7B68EE,#00C4CC)`, color: '#fff', padding: '10px 14px', borderRadius: 10, fontWeight: 700 }}>Assign Action</button>
                <button style={{ width: 48, borderRadius: 10, background: '#0b0e1f', color: PALETTE.body }}>✉️</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default StudentProfile;
