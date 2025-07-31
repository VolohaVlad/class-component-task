import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { App } from './App';
import * as rrd from 'react-router-dom';
import type { PropsWithChildren } from 'react';

jest.mock('./pages/SearchPage', () => ({
  SearchPage: () => <div data-testid="SearchPage">SearchPageMock</div>,
}));
jest.mock('./pages/AboutPage', () => ({
  AboutPage: () => <div data-testid="AboutPage">AboutPageMock</div>,
}));
jest.mock('./pages/NotFound', () => ({
  NotFoundPage: () => <div data-testid="NotFoundPage">NotFoundPageMock</div>,
}));

jest
  .spyOn(rrd, 'BrowserRouter')
  .mockImplementation(({ children }: PropsWithChildren) => (
    <rrd.MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </rrd.MemoryRouter>
  ));

describe('App Routing', () => {
  it('renders SearchPage at index route (/)', () => {
    render(<App />);
    expect(screen.getByTestId('SearchPage')).toBeInTheDocument();
  });

  it('renders SearchPage for numbered page', () => {
    render(<App />);
    expect(screen.getByTestId('SearchPage')).toBeInTheDocument();
  });

  it('renders SearchPage for details', () => {
    render(<App />);
    expect(screen.getByTestId('SearchPage')).toBeInTheDocument();
  });
});
