import React from 'react';
import LoginPage from './LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentAnalyticsDashboard from './components/Dashboard/StudentAnalyticsDashboard';
import StudentDashboardWrapper from './components/StudentAnalytics/StudentDashboardWrapper';
import InteractionTimelineWrapper from './components/StudentAnalytics/InteractionTimelineWrapper';
import './styles/global.css';

function App() {
  const isAuthenticated = () => localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <StudentAnalyticsDashboard />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/student-dashboard"
          element={
            isAuthenticated() ? (
              <StudentDashboardWrapper />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/student-interactions"
          element={
            isAuthenticated() ? (
              <InteractionTimelineWrapper />
            ) : (
              <LoginPage />
            )
          }
        />
        {/* Optional: Redirect root to login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;