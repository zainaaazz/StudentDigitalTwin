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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#8b57d4'}}></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No interaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <TimelineIcon className="w-8 h-8" style={{color: '#8b57d4'}} />
            <h1 className="text-3xl font-bold text-white">Interaction Timeline</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/student-dashboard"
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors"
              style={{backgroundColor: '#8b57d4'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3E46B6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#8b57d4'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Dashboard
            </Link>
            <button
              onClick={fetchInteractions}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#8b57d4' }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data.stats.totalInteractions}</p>
              <p className="text-sm text-gray-400">Total Interactions</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#8b57d4' }}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatDuration(Math.round(data.stats.averageDuration))}</p>
              <p className="text-sm text-gray-400">Average Duration</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#8b57d4' }}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data.stats.uniquePartners}</p>
              <p className="text-sm text-gray-400">Unique Partners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5" style={{color: '#8b57d4'}} />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Partner/Session</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter partner ID or session..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-400">
              Showing {filteredInteractions.length} of {data.stats.totalInteractions} interactions
            </p>
          </div>
        </div>
      </div>

      {/* Interactions Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700" style={{ backgroundColor: '#8b57d4' }}>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Partner</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Session</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInteractions.map((interaction) => (
                <tr key={interaction.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {new Date(interaction.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(interaction.startTime).toLocaleTimeString()} - {new Date(interaction.endTime).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatRelativeTime(interaction.startTime)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#8b57d41A'}}>
                        <span className="text-xs font-medium" style={{color: '#8b57d4'}}>
                          {interaction.studentId2.slice(-2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {interaction.partnerName || interaction.studentId2}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">
                        {formatDuration(interaction.duration)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-gray-300 bg-gray-700 px-2 py-1 rounded">
                      {interaction.sessionId.slice(-8)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-300">
                          {interaction.avgDistance.toFixed(1)}m
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
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
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium" style={{color: '#8b57d4'}}>
              Page {page}
            </span>
            <button
              disabled={!data.pagination.hasMore}
              onClick={() => setPage(page + 1)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Data from {new Date(data.stats.dateRange.start).toLocaleDateString()} to {new Date(data.stats.dateRange.end).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default InteractionTimeline;
