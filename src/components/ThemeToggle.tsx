import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  // Initialize state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  // Effect to apply the theme and save it
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle-button" title="Toggle theme">
      {/* Display sun icon for light mode, moon for dark mode */}
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
