import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { 
  Refresh,
  FilterList,
  Timeline as TimelineIcon,
  Person,
  Schedule,
  LocationOn,
  ArrowBack,
  Dashboard
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

interface InteractionEvent {
  id: string;
  sessionId: string;
  studentId1: string;
  studentId2: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  avgDistance: number;
  avgOrientationDiff: number;
  confidence: number;
  interactionType: 'discussion' | 'collaboration' | 'social' | 'help-seeking';
  context: 'lecture' | 'group-work' | 'break' | 'lab';
}

interface InteractionStats {
  totalInteractions: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  averageDuration: number;
  interactionsByType: Record<string, number>;
  interactionsByContext: Record<string, number>;
  uniquePartners: number;
}

interface InteractionData {
  interactions: InteractionEvent[];
  stats: InteractionStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface InteractionTimelineProps {
  studentId: string;
}

const InteractionTimeline: React.FC<InteractionTimelineProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<InteractionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [contextFilter, setContextFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchInteractions();
  }, [studentId, page, typeFilter, contextFilter]);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * itemsPerPage;
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`/api/sdt/student/${studentId}/interactions?${params}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert date strings to Date objects
        const processedData = {
          ...result.data,
          interactions: result.data.interactions.map((interaction: any) => ({
            ...interaction,
            startTime: new Date(interaction.startTime),
            endTime: new Date(interaction.endTime)
          })),
          stats: {
            ...result.data.stats,
            dateRange: {
              start: new Date(result.data.stats.dateRange.start),
              end: new Date(result.data.stats.dateRange.end)
            }
          }
        };
        setData(processedData);
      } else {
        setError(result.error || 'Failed to fetch interactions');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching interactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getInteractionTypeColor = (type: string) => {
    switch (type) {
      case 'discussion': return 'primary';
      case 'collaboration': return 'success';
      case 'social': return 'info';
      case 'help-seeking': return 'warning';
      default: return 'default';
    }
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'lecture': return 'default';
      case 'group-work': return 'primary';
      case 'lab': return 'secondary';
      case 'break': return 'info';
      default: return 'default';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  const filteredInteractions = data?.interactions.filter(interaction => {
    const matchesType = typeFilter === 'all' || interaction.interactionType === typeFilter;
    const matchesContext = contextFilter === 'all' || interaction.context === contextFilter;
    const matchesSearch = searchTerm === '' || 
      interaction.studentId2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.sessionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesContext && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No interaction data available
      </Alert>
    );
  }

  const totalPages = Math.ceil(data.pagination.total / itemsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      {/* Navigation Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Back to Student Dashboard">
            <IconButton onClick={() => navigate(`/student/${studentId}`)} color="primary">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <TimelineIcon color="primary" />
          <Typography variant="h5">
            Interaction Timeline
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            component={Link}
            to={`/student/${studentId}`}
            variant="outlined"
            startIcon={<Dashboard />}
          >
            View Dashboard
          </Button>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchInteractions} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {data.stats.totalInteractions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Interactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {formatDuration(Math.round(data.stats.averageDuration))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Duration
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {data.stats.uniquePartners}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Partners
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {Object.keys(data.stats.interactionsByType).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interaction Types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <FilterList color="primary" />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Interaction Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Interaction Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="discussion">Discussion</MenuItem>
                  <MenuItem value="collaboration">Collaboration</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                  <MenuItem value="help-seeking">Help-seeking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Context</InputLabel>
                <Select
                  value={contextFilter}
                  onChange={(e) => setContextFilter(e.target.value)}
                  label="Context"
                >
                  <MenuItem value="all">All Contexts</MenuItem>
                  <MenuItem value="lecture">Lecture</MenuItem>
                  <MenuItem value="group-work">Group Work</MenuItem>
                  <MenuItem value="lab">Lab</MenuItem>
                  <MenuItem value="break">Break</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Partner/Session"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredInteractions.length} of {data.stats.totalInteractions} interactions
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Interactions Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Partner</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Context</TableCell>
                  <TableCell>Session</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {format(interaction.startTime, 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(interaction.startTime, 'HH:mm')} - {format(interaction.endTime, 'HH:mm')}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(interaction.startTime, { addSuffix: true })}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {interaction.studentId2.slice(-2)}
                        </Avatar>
                        <Typography variant="body2">
                          {interaction.studentId2}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDuration(interaction.duration)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={interaction.interactionType.replace('-', ' ')}
                        color={getInteractionTypeColor(interaction.interactionType)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={interaction.context.replace('-', ' ')}
                        color={getContextColor(interaction.context)}
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {interaction.sessionId.slice(-8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title={`Distance: ${interaction.avgDistance.toFixed(1)}m`}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption">
                              {interaction.avgDistance.toFixed(1)}m
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {Math.round(interaction.confidence * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data from {format(data.stats.dateRange.start, 'MMM dd')} to {format(data.stats.dateRange.end, 'MMM dd, yyyy')}
        </Typography>
      </Box>
    </Box>
  );
};

export default InteractionTimeline;