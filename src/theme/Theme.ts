export type Theme = 'light' | 'dark';
export type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};
