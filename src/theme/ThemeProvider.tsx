import { type PropsWithChildren, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './Theme';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeStorage, setThemeStorage] = useLocalStorage<Theme>(
    'theme',
    'light'
  );
  const [theme, setTheme] = useState<Theme>(themeStorage());

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    setThemeStorage(theme);
    return () => {
      document.documentElement.classList.remove('dark', 'light');
    };
  }, [theme, setThemeStorage]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
