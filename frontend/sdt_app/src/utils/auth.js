// Authentication utilities including logout with simulation cleanup

export const logout = () => {
  // Get current student ID before clearing token
  const token = localStorage.getItem('token');
  let studentId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      studentId = payload.id_student;
    } catch (e) {
      console.error('Error parsing token for logout cleanup:', e);
    }
  }

  // Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');

  // Clear simulation data for this student
  if (studentId) {
    const simulationKey = `interaction_simulation_${studentId}`;
    sessionStorage.removeItem(simulationKey);
  }

  // Clear all simulation data as a fallback
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('interaction_simulation_')) {
      sessionStorage.removeItem(key);
    }
  });

  // Redirect to login page
  window.location.href = '/';
};

// Simple hash function for consistent anonymous naming
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate anonymous name for POPIA compliance
const generateAnonymousName = (studentId) => {
  const seed = hashCode(studentId);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letterIndex = seed % letters.length;
  const number = (seed % 99) + 1;

  return `Student ${letters[letterIndex]}${number.toString().padStart(2, '0')}`;
};

// Get anonymous name for other students (POPIA compliance)
export const getAnonymousName = (studentId) => {
  return generateAnonymousName(studentId);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id_student,
      name: `Student ${payload.id_student}`, // Show real student ID for the current user
      email: `student${payload.id_student}@university.edu`,
      role: payload.role
    };
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};