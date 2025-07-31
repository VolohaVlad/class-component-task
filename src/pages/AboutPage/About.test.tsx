import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders title and info', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Pokemon search application created by/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Version: 1.0.0/)).toBeInTheDocument();
  });

  it('renders and links to RS School React Course', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AboutPage />
      </MemoryRouter>
    );
    const rsaLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(rsaLink).toHaveAttribute('href', 'https://rs.school/react/');
    expect(rsaLink).toHaveAttribute('target', '_blank');
    expect(rsaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders and links back to Home page', () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AboutPage />
      </MemoryRouter>
    );
    const homeLink = screen.getByRole('link', { name: /back to home page/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
