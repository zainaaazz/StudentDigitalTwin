import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SimulationControl from './components/SimulationControl';
import StudentMonitor from './components/StudentMonitor';
import NetworkAnalysis from './components/NetworkAnalysis';
import StudentDashboardWrapper from './components/StudentDashboardWrapper';
import InteractionTimelineWrapper from './components/InteractionTimelineWrapper';
import StudentLookup from './components/StudentLookup';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulation" element={<SimulationControl />} />
              <Route path="/students" element={<StudentMonitor />} />
              <Route path="/network" element={<NetworkAnalysis />} />
              <Route path="/student-lookup" element={<StudentLookup />} />
              <Route path="/student/:studentId" element={<StudentDashboardWrapper />} />
              <Route path="/student/:studentId/interactions" element={<InteractionTimelineWrapper />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;