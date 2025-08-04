import React from 'react';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Layout;