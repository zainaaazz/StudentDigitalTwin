import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip
} from '@mui/material';
import { Person, Search, Dashboard, Timeline } from '@mui/icons-material';

// Sample student data for demo - Real names for students accessing their own data
const sampleStudents = [
  { id: 'STU_001', name: 'Alex Johnson', riskLevel: 'low' as const },
  { id: 'STU_002', name: 'Morgan Smith', riskLevel: 'high' as const },
  { id: 'STU_003', name: 'Casey Davis', riskLevel: 'medium' as const },
  { id: 'STU_004', name: 'Taylor Wilson', riskLevel: 'low' as const },
  { id: 'STU_005', name: 'Jordan Brown', riskLevel: 'high' as const },
  { id: 'STU_006', name: 'Riley Jones', riskLevel: 'low' as const },
  { id: 'STU_007', name: 'Avery Garcia', riskLevel: 'medium' as const },
  { id: 'STU_008', name: 'Cameron Martinez', riskLevel: 'low' as const },
];

const StudentLookup: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const filteredStudents = sampleStudents.filter(
    student =>
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDashboard = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const handleViewTimeline = (studentId: string) => {
    navigate(`/student/${studentId}/interactions`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard Access
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Search for a student to view their individual dashboard and interaction timeline.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Access by Student ID
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Enter Student ID (e.g., STU_001)"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  placeholder="STU_001, STU_002, etc."
                />
              </Box>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Dashboard />}
                  onClick={() => handleViewDashboard(selectedStudentId)}
                  disabled={!selectedStudentId.trim()}
                  fullWidth
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Timeline />}
                  onClick={() => handleViewTimeline(selectedStudentId)}
                  disabled={!selectedStudentId.trim()}
                  fullWidth
                >
                  View Timeline
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Students
              </Typography>
              <TextField
                fullWidth
                label="Search by name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Alex Johnson, STU_001, etc."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 2 }}
              />

              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {filteredStudents.map((student) => (
                  <ListItem key={student.id} disablePadding>
                    <ListItemButton onClick={() => handleViewDashboard(student.id)}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                          <Person fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body1">{student.name}</Typography>
                            <Chip
                              label={student.riskLevel.toUpperCase()}
                              color={getRiskColor(student.riskLevel)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={student.id}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Demo Information */}
      <Card sx={{ mt: 3, backgroundColor: 'action.hover' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Demo Information
          </Typography>
          <Typography variant="body2" paragraph>
            This is a demonstration of the Student Digital Twin dashboard system. The system provides:
          </Typography>
          <ul>
            <li>
              <strong>Individual Student Dashboards:</strong> Personal statistics, engagement trends, and interaction summaries
            </li>
            <li>
              <strong>Interaction Timelines:</strong> Detailed history of all student interactions with filtering and search capabilities
            </li>
            <li>
              <strong>Real-time Analytics:</strong> Charts and visualizations showing engagement patterns over time
            </li>
            <li>
              <strong>Risk Assessment:</strong> Automated identification of students who may need additional support
            </li>
          </ul>
          <Typography variant="body2">
            Try entering a student ID like <strong>STU_001</strong> or search for names like <strong>Alex Johnson</strong> to explore the features.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentLookup;