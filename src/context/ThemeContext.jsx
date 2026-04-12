import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isLight, setIsLight] = useState(() => localStorage.getItem('ss_theme') === 'light');

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isLight]);

  function toggleTheme() {
    setIsLight(prev => {
      const next = !prev;
      localStorage.setItem('ss_theme', next ? 'light' : 'dark');
      if (window.ssSound) window.ssSound('toggle');
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
