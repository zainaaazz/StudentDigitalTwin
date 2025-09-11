import React from 'react';
import { Link } from 'react-router-dom';
import { User, Activity as Timeline } from 'lucide-react';

const NavigationButton = ({ type = 'dashboard' }) => {
  const buttons = {
    dashboard: {
      to: '/student-dashboard',
      icon: <User className="w-4 h-4" />,
      text: 'Student Dashboard',
      description: 'View personal analytics'
    },
    interactions: {
      to: '/student-interactions', 
      icon: <Timeline className="w-4 h-4" />,
      text: 'Interaction Timeline',
      description: 'View detailed interactions'
    }
  };

  const config = buttons[type];

  return (
    <Link
      to={config.to}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      title={config.description}
    >
      {config.icon}
      <span className="ml-2">{config.text}</span>
    </Link>
  );
};

export default NavigationButton;