import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { ThemeContext } from './ThemeContext';
import userEvent from '@testing-library/user-event';

jest.mock('../hooks/useLocalStorage', () => {
  let stored = 'light';
  const get = () => stored;
  const set = (val: string) => {
    stored = val;
  };
  return {
    useLocalStorage: () => [get, set],
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light', 'dark');
  });

  it('by default theme = light and class is applied', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <span data-testid="theme">{theme}</span>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('setTheme("dark") changes context and html.class', async () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme, setTheme }) => (
            <>
              <span data-testid="theme">{theme}</span>
              <button onClick={() => setTheme('dark')}>Dark</button>
            </>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);

    await userEvent.click(screen.getByText('Dark'));

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});
