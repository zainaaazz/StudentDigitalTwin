import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { 
  Warning,
  TrendingUp,
  TrendingDown,
  Remove,
  Visibility,
  Timeline
} from '@mui/icons-material';

interface MockStudent {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  engagementScore: number;
  interactionCount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

const StudentMonitor: React.FC = () => {
  // Mock student data
  const [students] = useState<MockStudent[]>([
    { id: 'STU_001', name: 'Alice Johnson', riskLevel: 'low', engagementScore: 85, interactionCount: 12, trend: 'increasing' },
    { id: 'STU_002', name: 'Bob Smith', riskLevel: 'high', engagementScore: 32, interactionCount: 3, trend: 'decreasing' },
    { id: 'STU_003', name: 'Carol Davis', riskLevel: 'medium', engagementScore: 67, interactionCount: 8, trend: 'stable' },
    { id: 'STU_004', name: 'David Wilson', riskLevel: 'low', engagementScore: 78, interactionCount: 10, trend: 'increasing' },
    { id: 'STU_005', name: 'Eva Brown', riskLevel: 'high', engagementScore: 28, interactionCount: 2, trend: 'decreasing' },
  ]);

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
      case 'stable': return <Remove color="action" />;
      default: return null;
    }
  };

  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const avgEngagement = students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Monitoring
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Risk Students
              </Typography>
              <Box display="flex" alignItems="center">
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h4">
                  {highRiskCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Engagement
              </Typography>
              <Typography variant="h4">
                {avgEngagement.toFixed(0)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={avgEngagement} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students Monitored
              </Typography>
              <Typography variant="h4">
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Engagement Score</TableCell>
                <TableCell>Interactions</TableCell>
                <TableCell>Trend</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.riskLevel.toUpperCase()}
                      color={getRiskColor(student.riskLevel) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" sx={{ minWidth: 120 }}>
                      <LinearProgress
                        variant="determinate"
                        value={student.engagementScore}
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {student.engagementScore}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{student.interactionCount}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getTrendIcon(student.trend)}
                      <Typography variant="body2" sx={{ ml: 0.5, textTransform: 'capitalize' }}>
                        {student.trend}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Student Dashboard">
                        <IconButton
                          component={Link}
                          to={`/student/${student.id}`}
                          size="small"
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Interaction Timeline">
                        <IconButton
                          component={Link}
                          to={`/student/${student.id}/interactions`}
                          size="small"
                          color="secondary"
                        >
                          <Timeline />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentMonitor;