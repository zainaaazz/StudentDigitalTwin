import React from 'react';
import LoginPage from './LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentAnalyticsDashboard from './components/Dashboard/StudentAnalyticsDashboard';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            localStorage.getItem('token') ? (
              <StudentAnalyticsDashboard />
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