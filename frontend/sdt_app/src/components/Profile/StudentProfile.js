import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../layout/Layout';
import { useStudentData } from '../../hooks/useStudentData';
import '../../styles/studentProfile.css';

const MEDIA_THEME = 'green';

const StudentProfile = () => {
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

  const tiles = useMemo(
    () => [
      { id: 'tl', label: 'Engagement - GOOD', mediaSuffix: `${MEDIA_THEME}_top-left.jpg` },
      { id: 'bl', label: 'Interactivity - GOOD', mediaSuffix: `${MEDIA_THEME}_bottom-left.jpg` },
      { id: 'tr', label: 'Academic Performance - GOOD', mediaSuffix: `${MEDIA_THEME}_top-right.jpg` },
      { id: 'br', label: 'Overall Performance - GOOD', mediaSuffix: `${MEDIA_THEME}_bottom-right.jpg` }
    ],
    []
  );

  const renderTile = (tile) => (
    <div
      key={tile.id}
      className="sp-tile"
      onMouseEnter={() => showImage(tile.mediaSuffix)}
      onMouseLeave={hideImage}
    >
      <span className="sp-tile-label">{tile.label}</span>
    </div>
  );

  return (
    <Layout>
      <div className="sp-profile">
        <header className="sp-header">
          <h1 className="sp-title">Welcome {displayName}</h1>
        </header>

        <main className="sp-shell">
          <section className="sp-grid">
            <div className="sp-stack">
              {tiles.slice(0, 2).map(renderTile)}
            </div>

            <div
              className="sp-center"
              onMouseEnter={handleCenterMouseEnter}
            >
              <video
                id="heroVideo"
                ref={heroVideoRef}
                className="sp-hero-video"
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
                  className="sp-center-image"
                />
              )}
            </div>

            <div className="sp-stack">
              {tiles.slice(2).map(renderTile)}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default StudentProfile;
