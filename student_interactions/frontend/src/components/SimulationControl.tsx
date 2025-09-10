import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { PlayArrow, Stop, Settings } from '@mui/icons-material';

interface SimulationParams {
  courseId: string;
  sessionType: string;
  duration: number;
  studentCount: number;
}

const SimulationControl: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    courseId: '',
    sessionType: 'group-work',
    duration: 60,
    studentCount: 25
  });
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (field: keyof SimulationParams, value: string | number) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const generateStudentIds = (count: number): string[] => {
    return Array.from({ length: count }, (_, i) => `STU_${String(i + 1).padStart(3, '0')}`);
  };

  const runSimulation = async () => {
    if (!params.courseId.trim()) {
      setError('Please enter a course ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const studentIds = generateStudentIds(params.studentCount);
      
      const response = await fetch('/api/simulate/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: params.courseId,
          sessionType: params.sessionType,
          duration: params.duration,
          studentIds
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        setIsRunning(true);
      } else {
        setError(data.error || 'Simulation failed');
      }
    } catch (err) {
      setError('Failed to start simulation. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setResult(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Simulation Control
      </Typography>

      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuration
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Course ID"
                  value={params.courseId}
                  onChange={(e) => handleParamChange('courseId', e.target.value)}
                  placeholder="e.g., CS101"
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Session Type</InputLabel>
                  <Select
                    value={params.sessionType}
                    label="Session Type"
                    onChange={(e) => handleParamChange('sessionType', e.target.value)}
                  >
                    <MenuItem value="lecture">Lecture</MenuItem>
                    <MenuItem value="tutorial">Tutorial</MenuItem>
                    <MenuItem value="lab">Lab</MenuItem>
                    <MenuItem value="group-work">Group Work</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={params.duration}
                  onChange={(e) => handleParamChange('duration', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 10, max: 300 }}
                  fullWidth
                />

                <TextField
                  label="Number of Students"
                  type="number"
                  value={params.studentCount}
                  onChange={(e) => handleParamChange('studentCount', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 2, max: 100 }}
                  fullWidth
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                    onClick={runSimulation}
                    disabled={loading || isRunning}
                    fullWidth
                  >
                    {loading ? 'Starting...' : 'Start Simulation'}
                  </Button>

                  {isRunning && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Stop />}
                      onClick={stopSimulation}
                      fullWidth
                    >
                      Stop
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Panel */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Simulation Status
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={isRunning ? 'Running' : 'Stopped'} 
                  color={isRunning ? 'success' : 'default'}
                  sx={{ mr: 1 }}
                />
                {result && (
                  <Chip 
                    label={`${result.interactions?.length || 0} interactions`} 
                    color="info" 
                  />
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Session Results:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Session ID: {result.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students: {result.students?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactions Generated: {result.interactions?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Network Density: {((result.networkMetrics?.networkDensity || 0) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Clustering: {((result.networkMetrics?.avgClusteringCoeff || 0) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              )}

              {!result && !error && !loading && (
                <Typography variant="body2" color="text.secondary">
                  Configure parameters and start simulation to see results.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationControl;