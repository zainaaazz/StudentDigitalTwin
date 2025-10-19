import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Filter, Activity as TimelineIcon, MapPin, Clock, BarChart3, MessageCircle, Users } from 'lucide-react';
import { mockInteractionData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';
import GrainTexture from '../UI/GrainTexture';
import MountFuji from '../UI/MountFuji';

const InteractionTimeline = ({ currentUser = null }) => {
  const navigate = useNavigate();
  const { loading: simLoading, getInteractionHistory } = useInteractionSimulator(currentUser?.id);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="min-h-screen flex items-center justify-center bg-ksg-gradient relative overflow-hidden">
        <GrainTexture />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ksg-magenta relative z-10"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ksg-gradient relative overflow-hidden">
        <GrainTexture />
        <div className="text-center relative z-10">
          <p className="text-ksg-lilac">No interaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-ksg-gradient relative overflow-hidden">
      <GrainTexture />
      <MountFuji className="z-0" />
      {/* Navigation Header - Darker Anchor */}
      <div className="mb-8 relative z-10">
        <div className="backdrop-blur-strong bg-ksg-anchor-header rounded-3xl p-6 shadow-ksg-depth border border-ksg-slate/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all transform hover:scale-110 hover:rotate-3 bg-ksg-ground/80 backdrop-blur-glass border border-ksg-lilac/30 hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner"
              >
                <ArrowLeft className="w-5 h-5 text-ksg-lilac" />
              </button>
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(211,169,248,0.5)]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Interaction Timeline
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/student-dashboard"
                className="inline-flex items-center px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-ksg-glow bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal hover:shadow-ksg-hover font-bold tracking-relaxed"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
              <button
                onClick={fetchInteractions}
                disabled={loading}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all bg-ksg-ground/80 backdrop-blur-glass border border-ksg-lilac/30 text-ksg-lilac hover:shadow-ksg-hover hover:border-ksg-magenta/70 shadow-ksg-inner"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 relative z-10">
        <div className="group transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-teal/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-teal to-ksg-magenta shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 156, 238, 0.4))' }}>
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{data.stats.totalInteractions}</p>
                <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Total Interactions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="group transform hover:scale-105 hover:rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-coral/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-coral to-ksg-orange shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(255, 198, 168, 0.4))' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{formatDuration(Math.round(data.stats.averageDuration))}</p>
                <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Average Duration</p>
              </div>
            </div>
          </div>
        </div>
        <div className="group transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
          <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-6 hover:shadow-ksg-hover hover:border-ksg-lilac/50">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 bg-gradient-to-br from-ksg-lilac to-ksg-magenta shadow-lg" style={{ filter: 'drop-shadow(0 4px 8px rgba(211, 169, 248, 0.4))' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg tracking-tight" style={{ fontWeight: 800 }}>{data.stats.uniquePartners}</p>
                <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>Unique Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="group mb-6 relative z-10">
        <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 hover:shadow-ksg-hover transition-all duration-500">
          <div className="rounded-3xl p-6 bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
            <div className="flex items-center space-x-2 mb-6">
              <Filter className="w-5 h-5 text-ksg-lilac" />
              <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 600 }}>Search Partner/Session</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter partner ID or session..."
                  className="w-full px-4 py-3 rounded-2xl focus:ring-2 focus:ring-ksg-magenta focus:outline-none transition-all bg-ksg-ground/60 border border-ksg-slate/40 text-white placeholder-ksg-neutral font-medium"
                />
              </div>
              <div className="flex items-end">
                <p className="text-sm text-ksg-neutral font-medium tracking-relaxed" style={{ fontWeight: 500 }}>
                  Showing {filteredInteractions.length} of {data.stats.totalInteractions} interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactions Table */}
      <div className="group relative z-10">
        <div className="backdrop-blur-strong bg-ksg-card-deep rounded-3xl shadow-ksg-depth border border-ksg-slate/30 p-1 hover:shadow-ksg-hover transition-all duration-500">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-ksg-ground/40 via-ksg-slate/30 to-ksg-ground/40">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-ksg-charcoal/80 border-b-2 border-ksg-slate/40">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide">Partner</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide">Session</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ksg-slate/20">
                  {filteredInteractions.map((interaction, index) => (
                    <tr key={interaction.id} className="transition-all hover:bg-ksg-ground/40" style={{
                      background: index % 2 === 0 ? 'rgba(45, 40, 69, 0.2)' : 'rgba(74, 69, 101, 0.15)'
                    }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                        {new Date(interaction.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-ksg-neutral font-medium">
                        {new Date(interaction.startTime).toLocaleTimeString()} - {new Date(interaction.endTime).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-ksg-magenta font-medium">
                        {formatRelativeTime(interaction.startTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-ksg-teal to-ksg-magenta" style={{ filter: 'drop-shadow(0 2px 6px rgba(255, 156, 238, 0.3))' }}>
                        <span className="text-xs font-bold text-white">
                          {interaction.studentId2.slice(-2)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {interaction.partnerName || interaction.studentId2}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-ksg-coral" />
                      <span className="text-sm font-semibold text-white">
                        {formatDuration(interaction.duration)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono px-3 py-1 rounded-lg text-ksg-neutral-light bg-ksg-charcoal/60 border border-ksg-slate/30 font-semibold">
                      {interaction.sessionId.slice(-8)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3 text-ksg-sky" />
                        <span className="text-xs font-semibold text-ksg-neutral-light">
                          {interaction.avgDistance.toFixed(1)}m
                        </span>
                      </div>
                      <p className="text-xs text-ksg-neutral font-medium">
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
        <div className="px-6 py-4 border-t border-ksg-slate/30 bg-ksg-charcoal/60">
          <div className="flex items-center justify-center space-x-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-6 py-3 text-sm font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal border border-ksg-coral/30 disabled:from-ksg-ground/60 disabled:to-ksg-ground/60 disabled:text-ksg-neutral hover:scale-105 hover:shadow-ksg-glow tracking-relaxed"
            >
              Previous
            </button>
            <span className="px-5 py-3 text-sm font-bold text-white bg-ksg-ground/80 backdrop-blur-sm rounded-2xl border border-ksg-slate/40 shadow-ksg-inner">
              Page {page}
            </span>
            <button
              disabled={!data.pagination.hasMore}
              onClick={() => setPage(page + 1)}
              className="px-6 py-3 text-sm font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ksg-coral to-ksg-orange text-ksg-charcoal border border-ksg-coral/30 disabled:from-ksg-ground/60 disabled:to-ksg-ground/60 disabled:text-ksg-neutral hover:scale-105 hover:shadow-ksg-glow tracking-relaxed"
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
        <div className="backdrop-blur-strong bg-ksg-anchor-header rounded-3xl p-4 shadow-ksg-depth border border-ksg-slate/40 text-center">
          <p className="text-sm font-medium text-ksg-neutral-light tracking-relaxed" style={{ fontWeight: 500 }}>
            Data from {new Date(data.stats.dateRange.start).toLocaleDateString()} to {new Date(data.stats.dateRange.end).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionTimeline;
