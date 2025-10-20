import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'ksg'
    const savedTheme = localStorage.getItem('interactivityTheme');
    return savedTheme || 'ksg';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('interactivityTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'ksg' ? 'minidisc' : 'ksg');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isKSG: theme === 'ksg',
    isMiniDisc: theme === 'minidisc',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
