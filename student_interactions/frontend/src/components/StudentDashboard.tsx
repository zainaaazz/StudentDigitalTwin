import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  School,
  Groups,
  ChatBubble,
  Schedule,
  Assessment,
  Timeline,
  ArrowBack
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

interface StudentDashboardProps {
  studentId: string;
}

interface StudentProfile {
  id: string;
  name: string;
  academicLevel: string;
  major: string;
  currentGPA: number;
  riskLevel: 'low' | 'medium' | 'high';
  personalityType: string;
  participationScore: number;
}

interface EngagementHistory {
  week: string;
  date: Date;
  interactionFrequency: number;
  socialNetworkPosition: number;
  collaborationScore: number;
  overallRiskScore: number;
  sessionCount: number;
}

interface RecentInteractions {
  totalInteractions: number;
  averageDuration: number;
  topInteractionPartners: Array<{
    studentId: string;
    name: string;
    count: number;
  }>;
  interactionTypes: Record<string, number>;
}

interface CurrentStats {
  weeklyEngagement: number;
  networkCentrality: number;
  participationTrend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  lastActiveSession: Date;
  sessionsThisWeek: number;
}

interface DashboardData {
  student: StudentProfile;
  engagementHistory: EngagementHistory[];
  recentInteractions: RecentInteractions;
  currentStats: CurrentStats;
  lastUpdated: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [studentId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sdt/student/${studentId}/dashboard`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp color="success" />;
      case 'decreasing': return <TrendingDown color="error" />;
      case 'stable': return <TrendingFlat color="action" />;
      default: return <TrendingFlat />;
    }
  };

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
        No dashboard data available
      </Alert>
    );
  }

  const interactionTypeData = Object.entries(data.recentInteractions.interactionTypes).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count
  }));

  const engagementTrendData = data.engagementHistory.map(item => ({
    week: item.week,
    engagement: Math.round(item.interactionFrequency * 10),
    collaboration: item.collaborationScore,
    riskScore: item.overallRiskScore,
    sessions: item.sessionCount
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Navigation Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Back to Student Monitor">
            <IconButton onClick={() => navigate('/students')} color="primary">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">
            Student Dashboard
          </Typography>
        </Box>
        <Button
          component={Link}
          to={`/student/${studentId}/interactions`}
          variant="outlined"
          startIcon={<Timeline />}
          sx={{ ml: 2 }}
        >
          View Interaction Timeline
        </Button>
      </Box>

      {/* Header Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                  <Person fontSize="large" />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h4" gutterBottom>
                    {data.student.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {data.student.major} • {data.student.academicLevel}
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip 
                      label={`Risk Level: ${data.student.riskLevel.toUpperCase()}`}
                      color={getRiskColor(data.student.riskLevel)}
                      size="small"
                    />
                    <Chip 
                      label={`GPA: ${data.student.currentGPA.toFixed(2)}`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip 
                      label={data.student.personalityType}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Week Stats
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Weekly Engagement</Typography>
                  <Typography variant="body2">{data.currentStats.weeklyEngagement}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={data.currentStats.weeklyEngagement} 
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Network Centrality</Typography>
                  <Typography variant="body2">{Math.round(data.currentStats.networkCentrality * 100)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={data.currentStats.networkCentrality * 100} 
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Participation Trend</Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getTrendIcon(data.currentStats.participationTrend)}
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {data.currentStats.participationTrend}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ChatBubble color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{data.recentInteractions.totalInteractions}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Interactions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{Math.round(data.recentInteractions.averageDuration / 60)}m</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Duration
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Groups color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{data.recentInteractions.topInteractionPartners.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Partners
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{data.currentStats.sessionsThisWeek}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sessions This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Trends Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8884d8" 
                    name="Engagement Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="collaboration" 
                    stroke="#82ca9d" 
                    name="Collaboration Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interaction Types
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={interactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {interactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Interactions and Partners */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Interaction Partners
              </Typography>
              <List>
                {data.recentInteractions.topInteractionPartners.map((partner, index) => (
                  <ListItem key={partner.studentId} divider={index < data.recentInteractions.topInteractionPartners.length - 1}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        {partner.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={partner.name}
                      secondary={`${partner.count} interactions`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Session Activity
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={engagementTrendData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="sessions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {format(new Date(data.lastUpdated), 'PPpp')}
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentDashboard;