import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setThemeMock = jest.fn();
jest.mock('../../hooks/UseTheme', () => ({
  useTheme: jest.fn(),
}));

import { useTheme } from '../../hooks/UseTheme';
import { ThemeToggle } from './ThemeToggle';

const mockedUseTheme = useTheme as jest.Mock;
beforeEach(() => {
  setThemeMock.mockClear();
});

describe('ThemeToggle', () => {
  it('Light button is checked if theme === "light"', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme: setThemeMock });
    render(<ThemeToggle />);
    const light = screen.getByLabelText(/light/i) as HTMLInputElement;
    const dark = screen.getByLabelText(/dark/i) as HTMLInputElement;
    expect(light.checked).toBe(true);
    expect(dark.checked).toBe(false);
  });

  it('Dark button is checked if theme === "dark"', () => {
    mockedUseTheme.mockReturnValue({ theme: 'dark', setTheme: setThemeMock });
    render(<ThemeToggle />);
    const light = screen.getByLabelText(/light/i) as HTMLInputElement;
    const dark = screen.getByLabelText(/dark/i) as HTMLInputElement;
    expect(light.checked).toBe(false);
    expect(dark.checked).toBe(true);
  });

  it('calls setTheme with "light" when light is selected', async () => {
    mockedUseTheme.mockReturnValue({ theme: 'dark', setTheme: setThemeMock });
    render(<ThemeToggle />);
    const light = screen.getByLabelText(/light/i);
    await userEvent.click(light);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when dark is selected', async () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme: setThemeMock });
    render(<ThemeToggle />);
    const dark = screen.getByLabelText(/dark/i);
    await userEvent.click(dark);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
