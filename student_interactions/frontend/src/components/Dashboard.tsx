import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp,
  Group,
  School,
  Warning
} from '@mui/icons-material';

interface DashboardStats {
  totalStudents: number;
  activeSessions: number;
  avgEngagement: number;
  highRiskStudents: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeSessions: 0,
    avgEngagement: 0,
    highRiskStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard stats
    setTimeout(() => {
      setStats({
        totalStudents: 150,
        activeSessions: 3,
        avgEngagement: 67,
        highRiskStudents: 8
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {loading ? <LinearProgress /> : value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Group />}
            color="#1976d2"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Sessions"
            value={stats.activeSessions}
            icon={<School />}
            color="#2e7d32"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Engagement"
            value={`${stats.avgEngagement}%`}
            icon={<TrendingUp />}
            color="#ed6c02"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Risk Students"
            value={stats.highRiskStudents}
            icon={<Warning />}
            color="#d32f2f"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
              {loading ? (
                <LinearProgress />
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • New simulation session started for CS101
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Risk alert generated for Student ID: STU_047
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Network analysis completed for group-work session
                  </Typography>
                  <Typography variant="body2">
                    • Engagement metrics updated for 25 students
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">API Service</Typography>
                <Typography variant="body2" color="success.main">Online</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">Database</Typography>
                <Typography variant="body2" color="success.main">Connected</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">WebSocket</Typography>
                <Typography variant="body2" color="success.main">Active</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Simulation Engine</Typography>
                <Typography variant="body2" color="success.main">Ready</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;