import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Filter, Activity as TimelineIcon, MapPin, Clock, BarChart3, MessageCircle, Users } from 'lucide-react';
import { mockInteractionData } from './dummyData';
import { useInteractionSimulator } from '../../hooks/useInteractionSimulator';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <p className="text-teal-100">No interaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all transform hover:scale-105 bg-indigo-950/50 backdrop-blur-md border border-indigo-800/50 hover:shadow-teal-500/50"
            >
              <ArrowLeft className="w-5 h-5 text-teal-400" />
            </button>
            <h1 className="text-3xl font-bold drop-shadow-lg text-teal-100">Interaction Timeline</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/student-dashboard"
              className="inline-flex items-center px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/30"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Dashboard
            </Link>
            <button
              onClick={fetchInteractions}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 rounded-lg transition-all bg-indigo-950/50 backdrop-blur-md border border-indigo-800/50 text-teal-400 hover:shadow-teal-500/50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{data.stats.totalInteractions}</p>
                  <p className="text-sm text-teal-400 font-medium">Total Interactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{formatDuration(Math.round(data.stats.averageDuration))}</p>
                  <p className="text-sm text-cyan-400 font-medium">Average Duration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="group transform hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50">
            <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl mr-4 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-teal-100 drop-shadow-lg">{data.stats.uniquePartners}</p>
                  <p className="text-sm text-teal-400 font-medium">Unique Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="group mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50 transition-all duration-300">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-teal-100">Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-teal-200">Search Partner/Session</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter partner ID or session..."
                  className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all bg-indigo-900/40 border border-teal-500/30 text-teal-100 placeholder-teal-400/50"
                />
              </div>
              <div className="flex items-end">
                <p className="text-sm text-cyan-400">
                  Showing {filteredInteractions.length} of {data.stats.totalInteractions} interactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactions Table */}
      <div className="group">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-1 hover:shadow-cyan-500/50 transition-all duration-300">
          <div className="bg-indigo-950/50 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 to-cyan-600 border-b-2 border-indigo-800/50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Partner</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Session</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-500/20">
                  {filteredInteractions.map((interaction, index) => (
                    <tr key={interaction.id} className="transition-all hover:bg-indigo-900/40" style={{
                      background: index % 2 === 0 ? 'rgba(20, 184, 166, 0.05)' : 'rgba(6, 182, 212, 0.05)'
                    }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-teal-100">
                        {new Date(interaction.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-cyan-400">
                        {new Date(interaction.startTime).toLocaleTimeString()} - {new Date(interaction.endTime).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-teal-500">
                        {formatRelativeTime(interaction.startTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-gradient-to-br from-teal-500 to-emerald-600">
                        <span className="text-xs font-bold text-white">
                          {interaction.studentId2.slice(-2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-teal-100">
                        {interaction.partnerName || interaction.studentId2}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-teal-100">
                        {formatDuration(interaction.duration)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono px-2 py-1 rounded text-teal-200 bg-indigo-900/40 border border-teal-500/30">
                      {interaction.sessionId.slice(-8)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs font-medium text-teal-200">
                          {interaction.avgDistance.toFixed(1)}m
                        </span>
                      </div>
                      <p className="text-xs text-teal-400">
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
        <div className="px-6 py-4 border-t border-indigo-800/50 bg-gradient-to-r from-indigo-900/40 to-cyan-900/40">
          <div className="flex items-center justify-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-emerald-600 text-white border border-teal-500/30 disabled:from-indigo-900/40 disabled:to-indigo-900/40 disabled:text-teal-500"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-bold text-teal-100">
              Page {page}
            </span>
            <button
              disabled={!data.pagination.hasMore}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-emerald-600 text-white border border-teal-500/30 disabled:from-indigo-900/40 disabled:to-indigo-900/40 disabled:text-teal-500"
            >
              Next
            </button>
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm font-medium drop-shadow-lg text-teal-100">
          Data from {new Date(data.stats.dateRange.start).toLocaleDateString()} to {new Date(data.stats.dateRange.end).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default InteractionTimeline;
