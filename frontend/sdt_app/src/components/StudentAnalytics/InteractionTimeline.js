import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Filter, Activity as TimelineIcon, MapPin, Clock, BarChart3, MessageCircle, Users } from 'lucide-react';
import { mockInteractionData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import GrainTexture from '../UI/GrainTexture';
import MountFuji from '../UI/MountFuji';
import CircularReflections from '../UI/CircularReflections';
import { useTheme } from '../../contexts/ThemeContext';

const InteractionTimeline = ({ currentUser = null }) => {
  const navigate = useNavigate();
  const { loading: simLoading, getInteractionHistory } = useInteractionSimulator(currentUser?.id);
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get the background gradient class
  const getBgGradient = () => {
    if (isKSG) return 'bg-ksg-gradient';
    if (isKSGMirror) return 'bg-ksg-gradient-mirror';
    if (isProfessional) return 'bg-white';
    return 'bg-md-gradient';
  };

  useEffect(() => {
    fetchInteractions();
  }, [page, simLoading]);

  const fetchInteractions = () => {
    if (simLoading) return;

    setLoading(true);
    // Use simulation engine if currentUser is available
    setTimeout(() => {
      if (currentUser?.id) {
        const interactions = getInteractionHistory();

        // Calculate stats from interactions to match expected data structure
        const stats = {
          totalInteractions: interactions.length,
          dateRange: {
            start: interactions.length > 0 ? new Date(Math.min(...interactions.map(i => i.startTime))) : new Date(),
            end: interactions.length > 0 ? new Date(Math.max(...interactions.map(i => i.startTime))) : new Date()
          },
          averageDuration: interactions.length > 0 ? Math.round(interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length) : 0,
          uniquePartners: new Set(interactions.map(i => i.studentId2)).size
        };

        // Add pagination structure
        const pagination = {
          total: interactions.length,
          limit: 20,
          offset: 0,
          hasMore: false // Since we're showing all interactions at once
        };

        setData({ interactions, stats, pagination });
      } else {
        setData(mockInteractionData);
      }
      setLoading(false);
    }, 300);
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const interactions = Array.isArray(data) ? data : data?.interactions || [];
  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = searchTerm === '' ||
      (interaction.partnerName || interaction.studentId2).toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.sessionId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${getBgGradient()}`}>
        {isKSGVariant && <GrainTexture />}
        {!isKSGVariant && !isProfessional && <CircularReflections />}
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 relative z-10 ${
          isKSGVariant ? 'border-ksg-magenta' : isProfessional ? 'border-pro-primary' : 'border-md-lavender-neon'
        }`}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${getBgGradient()}`}>
        {isKSGVariant && <GrainTexture />}
        {!isKSGVariant && !isProfessional && <CircularReflections />}
        <div className="text-center relative z-10">
          <p className={isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-pro-text' : 'text-md-charcoal'}>No interaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 relative overflow-hidden ${getBgGradient()}`}>
      {isKSGVariant && <GrainTexture />}
      {isKSGVariant && <MountFuji className="z-0" />}
      {!isKSGVariant && !isProfessional && <CircularReflections />}
      {/* Navigation Header - Darker Anchor */}
      <div className="mb-8 relative z-10">
        <div className={`backdrop-blur-glass p-6 border ${
          isKSGVariant
            ? 'bg-ksg-anchor-header rounded-3xl shadow-ksg-depth border-ksg-slate/40'
            : isProfessional
            ? 'bg-pro-header rounded-[14px] shadow-pro-float border-pro-border/50'
            : 'bg-md-anchor-header rounded-3xl shadow-md-holographic border-md-grey-metallic'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student-dashboard')}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all transform hover:scale-110 backdrop-blur-glass border ${
                  isKSGVariant
                    ? 'hover:rotate-3 bg-ksg-ground/80 border-ksg-lilac/30 hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner'
                    : isProfessional
                    ? 'bg-white border-pro-border hover:shadow-pro-hover hover:border-pro-primary'
                    : 'bg-white/40 border-md-grey-metallic hover:shadow-md-hover hover:border-md-lavender-neon shadow-md-inner'
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-pro-primary' : 'text-md-charcoal'
                }`} />
              </button>
              <h1 className={`text-4xl font-bold tracking-tight ${
                isKSGVariant
                  ? 'text-white drop-shadow-[0_2px_10px_rgba(211,169,248,0.5)]'
                  : isProfessional
                  ? 'text-pro-text'
                  : 'text-white drop-shadow-[0_2px_10px_rgba(211,169,248,0.5)]'
              }`} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Interaction Timeline
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/student-dashboard"
                className={`inline-flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 font-bold tracking-relaxed ${
                  isKSGVariant
                    ? 'shadow-ksg-glow bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal hover:shadow-ksg-hover'
                    : isProfessional
                    ? 'bg-pro-sidebar-gradient text-white hover:shadow-pro-hover shadow-pro-card'
                    : 'shadow-md-holographic bg-gradient-to-r from-md-lavender to-md-lavender-light text-md-charcoal hover:shadow-md-hover'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
              <button
                onClick={fetchInteractions}
                disabled={loading}
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all backdrop-blur-glass border ${
                  isKSGVariant
                    ? 'bg-ksg-ground/80 border-ksg-lilac/30 text-ksg-lilac hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner'
                    : isProfessional
                    ? 'bg-white border-pro-border text-pro-primary hover:shadow-pro-hover hover:border-pro-primary'
                    : 'bg-white/40 border-md-grey-metallic text-md-charcoal hover:shadow-md-hover hover:border-md-lavender-neon shadow-md-inner'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 relative z-10">
        <div className={`group transform transition-all duration-300 ${
          isKSGVariant ? 'hover:scale-105 hover:-rotate-1' : isProfessional ? 'hover:scale-[1.02]' : 'hover:scale-105 hover:-rotate-1'
        }`}>
          <div className={`backdrop-blur-strong p-6 border ${
            isKSGVariant
              ? 'bg-ksg-card-deep rounded-3xl shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover hover:border-ksg-teal/50'
              : isProfessional
              ? 'bg-white rounded-lg shadow-pro-card border-gray-200 hover:shadow-pro-hover hover:border-pro-primary/30'
              : 'bg-md-card-deep rounded-3xl shadow-md-holographic border-md-grey-metallic hover:shadow-md-hover hover:border-md-lavender-neon'
          }`}>
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-4 shadow-lg ${
                isKSGVariant
                  ? 'bg-gradient-to-br from-ksg-teal to-ksg-magenta'
                  : isProfessional
                  ? 'bg-gradient-to-br from-pro-primary to-pro-primary-strong'
                  : 'bg-gradient-to-br from-md-lavender to-md-lavender-light'
              }`} style={{ filter: isKSGVariant ? 'drop-shadow(0 4px 8px rgba(255, 156, 238, 0.4))' : 'drop-shadow(0 4px 8px rgba(181, 138, 255, 0.4))' }}>
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-4xl font-bold tracking-tight ${
                  isKSGVariant ? 'text-white drop-shadow-lg' : isProfessional ? 'text-pro-text' : 'text-white drop-shadow-lg'
                }`} style={{ fontWeight: isKSGVariant ? 800 : isProfessional ? 700 : 600 }}>{data.stats.totalInteractions}</p>
                <p className={`text-sm font-medium tracking-relaxed ${
                  isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                }`} style={{ fontWeight: 500 }}>Total Interactions</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`group transform transition-all duration-300 ${
          isKSGVariant ? 'hover:scale-105 hover:rotate-1' : isProfessional ? 'hover:scale-[1.02]' : 'hover:scale-105 hover:rotate-1'
        }`}>
          <div className={`backdrop-blur-strong p-6 border ${
            isKSGVariant
              ? 'bg-ksg-card-deep rounded-3xl shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover hover:border-ksg-coral/50'
              : isProfessional
              ? 'bg-white rounded-lg shadow-pro-card border-gray-200 hover:shadow-pro-hover hover:border-pro-info/30'
              : 'bg-md-card-deep rounded-3xl shadow-md-holographic border-md-grey-metallic hover:shadow-md-hover hover:border-md-lavender-neon'
          }`}>
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-4 shadow-lg ${
                isKSGVariant
                  ? 'bg-ksg-coral'
                  : isProfessional
                  ? 'bg-pro-info'
                  : 'bg-md-cyan-soft'
              }`}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-4xl font-bold tracking-tight ${
                  isKSGVariant ? 'text-white drop-shadow-lg' : isProfessional ? 'text-pro-text' : 'text-white drop-shadow-lg'
                }`} style={{ fontWeight: isKSGVariant ? 800 : isProfessional ? 700 : 600 }}>{formatDuration(Math.round(data.stats.averageDuration))}</p>
                <p className={`text-sm font-medium tracking-relaxed ${
                  isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                }`} style={{ fontWeight: 500 }}>Average Duration</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`group transform transition-all duration-300 ${
          isKSGVariant ? 'hover:scale-105 hover:-rotate-1' : isProfessional ? 'hover:scale-[1.02]' : 'hover:scale-105 hover:-rotate-1'
        }`}>
          <div className={`backdrop-blur-strong p-6 border ${
            isKSGVariant
              ? 'bg-ksg-card-deep rounded-3xl shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover hover:border-ksg-lilac/50'
              : isProfessional
              ? 'bg-white rounded-lg shadow-pro-card border-gray-200 hover:shadow-pro-hover hover:border-pro-success/30'
              : 'bg-md-card-deep rounded-3xl shadow-md-holographic border-md-grey-metallic hover:shadow-md-hover hover:border-md-lavender-neon'
          }`}>
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-4 shadow-lg ${
                isKSGVariant
                  ? 'bg-ksg-lilac'
                  : isProfessional
                  ? 'bg-pro-success'
                  : 'bg-md-peach-soft'
              }`}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-4xl font-bold tracking-tight ${
                  isKSGVariant ? 'text-white drop-shadow-lg' : isProfessional ? 'text-pro-text' : 'text-white drop-shadow-lg'
                }`} style={{ fontWeight: isKSGVariant ? 800 : isProfessional ? 700 : 600 }}>{data.stats.uniquePartners}</p>
                <p className={`text-sm font-medium tracking-relaxed ${
                  isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                }`} style={{ fontWeight: 500 }}>Unique Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="group mb-6 relative z-10">
        <div className={`backdrop-blur-strong p-1 border transition-all duration-500 ${
          isKSGVariant
            ? 'bg-ksg-card-deep rounded-3xl shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover'
            : isProfessional
            ? 'bg-white rounded-lg shadow-pro-card border-gray-200 hover:shadow-pro-hover'
            : 'bg-md-card-deep rounded-3xl shadow-md-holographic border-md-grey-metallic hover:shadow-md-hover'
        }`}>
          <div className={`p-6 ${
            isKSGVariant
              ? 'rounded-3xl bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40'
              : isProfessional
              ? 'rounded-lg'
              : 'rounded-3xl bg-gradient-to-br from-white/20 via-md-grey-metallic to-white/20'
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <Filter className={`w-5 h-5 ${
                isKSGVariant ? 'text-ksg-lilac' : isProfessional ? 'text-pro-primary' : 'text-ksg-lilac'
              }`} />
              <h3 className={`text-2xl font-bold tracking-tight ${
                isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
              }`} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 tracking-relaxed ${
                  isKSGVariant ? 'text-ksg-neutral-light' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral-light'
                }`} style={{ fontWeight: 600 }}>Search Partner/Session</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter partner ID or session..."
                  className={`w-full px-4 py-3 rounded-2xl focus:outline-none transition-all border font-medium ${
                    isKSGVariant
                      ? 'focus:ring-2 focus:ring-ksg-magenta bg-ksg-ground/60 border-ksg-slate/40 text-white placeholder-ksg-neutral'
                      : isProfessional
                      ? 'focus:ring-2 focus:ring-pro-primary bg-white border-gray-300 text-pro-text placeholder-gray-400'
                      : 'focus:ring-2 focus:ring-ksg-magenta bg-ksg-ground/60 border-ksg-slate/40 text-white placeholder-ksg-neutral'
                  }`}
                />
              </div>
              <div className="flex items-end">
                <p className={`text-sm font-medium tracking-relaxed ${
                  isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                }`} style={{ fontWeight: 500 }}>
                  Showing {filteredInteractions.length} of {data.stats.totalInteractions} interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactions Table */}
      <div className="group relative z-10">
        <div className={`backdrop-blur-strong p-1 border transition-all duration-500 ${
          isKSGVariant
            ? 'bg-ksg-card-deep rounded-3xl shadow-ksg-depth border-ksg-slate/30 hover:shadow-ksg-hover'
            : isProfessional
            ? 'bg-white rounded-lg shadow-pro-card border-gray-200 hover:shadow-pro-hover'
            : 'bg-md-card-deep rounded-3xl shadow-md-holographic border-md-grey-metallic hover:shadow-md-hover'
        }`}>
          <div className={`overflow-hidden ${
            isKSGVariant
              ? 'rounded-3xl bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40'
              : isProfessional
              ? 'rounded-lg'
              : 'rounded-3xl bg-gradient-to-br from-white/20 via-md-grey-metallic to-white/20'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${
                    isKSGVariant
                      ? 'bg-ksg-charcoal/80 border-ksg-slate/40'
                      : isProfessional
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-ksg-charcoal/80 border-ksg-slate/40'
                  }`}>
                    <th className={`px-6 py-4 text-left text-sm font-bold tracking-wide ${
                      isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                    }`}>Time</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold tracking-wide ${
                      isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                    }`}>Partner</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold tracking-wide ${
                      isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                    }`}>Duration</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold tracking-wide ${
                      isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                    }`}>Session</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold tracking-wide ${
                      isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                    }`}>Details</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isKSGVariant ? 'divide-ksg-slate/20' : isProfessional ? 'divide-gray-200' : 'divide-md-grey-metallic'
                }`}>
                  {filteredInteractions.map((interaction, index) => (
                    <tr key={interaction.id} className={`transition-all ${
                      isKSGVariant
                        ? 'hover:bg-ksg-ground/40'
                        : isProfessional
                        ? 'hover:bg-gray-50'
                        : 'hover:bg-ksg-ground/40'
                    }`} style={{
                      background: isKSGVariant
                        ? (index % 2 === 0 ? 'rgba(45, 40, 69, 0.2)' : 'rgba(74, 69, 101, 0.15)')
                        : isProfessional
                        ? (index % 2 === 0 ? 'transparent' : 'rgba(249, 250, 251, 0.5)')
                        : (index % 2 === 0 ? 'rgba(45, 40, 69, 0.2)' : 'rgba(74, 69, 101, 0.15)')
                    }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm font-semibold ${
                            isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                          }`}>
                        {new Date(interaction.startTime).toLocaleDateString()}
                      </p>
                      <p className={`text-xs font-medium ${
                        isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                      }`}>
                        {new Date(interaction.startTime).toLocaleTimeString()} - {new Date(interaction.endTime).toLocaleTimeString()}
                      </p>
                      <p className={`text-xs font-medium ${
                        isKSGVariant ? 'text-ksg-magenta' : isProfessional ? 'text-pro-primary' : 'text-ksg-magenta'
                      }`}>
                        {formatRelativeTime(interaction.startTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        isKSGVariant
                          ? 'bg-gradient-to-br from-ksg-teal to-ksg-magenta'
                          : isProfessional
                          ? 'bg-gradient-to-br from-pro-primary to-pro-primary-strong'
                          : 'bg-gradient-to-br from-md-lavender to-md-lavender-light'
                      }`} style={{ filter: isKSGVariant ? 'drop-shadow(0 2px 6px rgba(255, 156, 238, 0.3))' : 'drop-shadow(0 2px 6px rgba(181, 138, 255, 0.3))' }}>
                        <span className="text-xs font-bold text-white">
                          {interaction.studentId2.slice(-2)}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                      }`}>
                        {interaction.partnerName || interaction.studentId2}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${
                        isKSGVariant ? 'text-ksg-coral' : isProfessional ? 'text-pro-info' : 'text-ksg-coral'
                      }`} />
                      <span className={`text-sm font-semibold ${
                        isKSGVariant ? 'text-white' : isProfessional ? 'text-pro-text' : 'text-white'
                      }`}>
                        {formatDuration(interaction.duration)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className={`text-xs font-mono px-3 py-1 rounded-lg font-semibold border ${
                      isKSGVariant
                        ? 'text-ksg-neutral-light bg-ksg-charcoal/60 border-ksg-slate/30'
                        : isProfessional
                        ? 'text-pro-text-muted bg-gray-100 border-gray-200'
                        : 'text-ksg-neutral-light bg-ksg-charcoal/60 border-ksg-slate/30'
                    }`}>
                      {interaction.sessionId.slice(-8)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className={`w-3 h-3 ${
                          isKSGVariant ? 'text-ksg-sky' : isProfessional ? 'text-pro-success' : 'text-ksg-sky'
                        }`} />
                        <span className={`text-xs font-semibold ${
                          isKSGVariant ? 'text-ksg-neutral-light' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral-light'
                        }`}>
                          {interaction.avgDistance.toFixed(1)}m
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${
                        isKSGVariant ? 'text-ksg-neutral' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral'
                      }`}>
                        Confidence: {Math.round(interaction.confidence * 100)}%
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`px-6 py-4 border-t ${
          isKSGVariant
            ? 'border-ksg-slate/30 bg-ksg-charcoal/60'
            : isProfessional
            ? 'border-gray-200 bg-gray-50'
            : 'border-ksg-slate/30 bg-ksg-charcoal/60'
        }`}>
          <div className="flex items-center justify-center space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-6 py-3 text-sm font-bold rounded-2xl transition-all shadow-md disabled:cursor-not-allowed border tracking-relaxed ${
                isKSGVariant
                  ? 'bg-ksg-coral text-white border-ksg-coral disabled:bg-ksg-ground/60 disabled:text-ksg-neutral disabled:opacity-50 hover:scale-105 hover:shadow-ksg-glow'
                  : isProfessional
                  ? 'bg-pro-primary text-white border-pro-primary disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:opacity-50 hover:shadow-pro-hover hover:bg-pro-primary-strong'
                  : 'bg-md-lavender text-white border-md-lavender disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 hover:scale-105 hover:shadow-md-glow'
              }`}
            >
              Previous
            </button>
            <span className={`px-5 py-3 text-sm font-bold backdrop-blur-sm rounded-2xl border ${
              isKSGVariant
                ? 'text-white bg-ksg-ground/80 border-ksg-slate/40 shadow-ksg-inner'
                : isProfessional
                ? 'text-pro-text bg-white border-gray-300 shadow-pro-card'
                : 'text-white bg-ksg-ground/80 border-ksg-slate/40 shadow-ksg-inner'
            }`}>
              Page {page}
            </span>
            <button
              disabled={!data.pagination.hasMore}
              onClick={() => setPage(page + 1)}
              className={`px-6 py-3 text-sm font-bold rounded-2xl transition-all shadow-md disabled:cursor-not-allowed border tracking-relaxed ${
                isKSGVariant
                  ? 'bg-ksg-coral text-white border-ksg-coral disabled:bg-ksg-ground/60 disabled:text-ksg-neutral disabled:opacity-50 hover:scale-105 hover:shadow-ksg-glow'
                  : isProfessional
                  ? 'bg-pro-primary text-white border-pro-primary disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:opacity-50 hover:shadow-pro-hover hover:bg-pro-primary-strong'
                  : 'bg-md-lavender text-white border-md-lavender disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-50 hover:scale-105 hover:shadow-md-glow'
              }`}
            >
              Next
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Footer Anchor */}
      <div className="mt-8 relative z-10">
        <div className={`backdrop-blur-glass p-4 border text-center ${
          isKSGVariant
            ? 'bg-ksg-anchor-header rounded-3xl shadow-ksg-depth border-ksg-slate/40'
            : isProfessional
            ? 'bg-pro-header rounded-[14px] shadow-pro-card border-pro-border/50'
            : 'bg-ksg-anchor-header rounded-3xl shadow-ksg-depth border-ksg-slate/40'
        }`}>
          <p className={`text-sm font-medium tracking-relaxed ${
            isKSGVariant ? 'text-ksg-neutral-light' : isProfessional ? 'text-pro-text-muted' : 'text-ksg-neutral-light'
          }`} style={{ fontWeight: 500 }}>
            Data from {new Date(data.stats.dateRange.start).toLocaleDateString()} to {new Date(data.stats.dateRange.end).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionTimeline;
