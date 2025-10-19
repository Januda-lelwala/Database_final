import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const VARS_STYLE_ID = 'kandypack-theme-vars';

const lightVars = `
:root {
  --bg: #f1f5f9;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --header: #1e293b;
  --header-text: #f8fafc;
  --border: #e2e8f0;
}
`;

const darkVars = `
[data-theme="dark"] {
  --bg: #0b1220;
  --card: #0f172a;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --header: #0a0f1b;
  --header-text: #e2e8f0;
  --border: #1f2937;
}
`;

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  // Inject CSS variables once
  useEffect(() => {
    if (!document.getElementById(VARS_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = VARS_STYLE_ID;
      style.textContent = `${lightVars}\n${darkVars}`;
      document.head.appendChild(style);
    }
  }, []);

  // Initialize from storage or prefers-color-scheme
  useEffect(() => {
    const saved = localStorage.getItem('kandypack_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  // Apply data-theme attribute for theme switching
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kandypack_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
