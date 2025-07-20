import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import { server } from './test-utils/mocks/server.ts';
import { http, HttpResponse } from 'msw';

const SEARCH_TERM_KEY = 'searchTerm';

beforeEach(() => {
  localStorage.clear();
});

test('renders  search', async () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Search Pokemon/i)).toBeInTheDocument();
});

test('shows Spinner during loading', async () => {
  render(<App />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });
});

test('handles fetch error gracefully', async () => {
  server.use(
    http.get('https://pokeapi.co/api/v2/pokemon', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('Failed to load list')).toBeInTheDocument();
  });
});

test('searches with term and stores in localStorage', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    /Search Pokemon.../i
  ) as HTMLInputElement;
  const button = screen.getByRole('button', { name: /search/i });

  fireEvent.change(input, { target: { value: 'test123' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('test123');
  });
});

test('paginates when next/prev clicked', async () => {
  server.use(
    http.get('https://pokeapi.co/api/v2/pokemon', () => {
      return HttpResponse.json(
        {
          count: 40,
          results: [{ name: 'bulbasaur', url: 'testurl1' }],
        },
        { status: 200 }
      );
    })
  );

  render(<App />);
  const buttonNextBeforeClick = await screen.findByRole('button', {
    name: 'Next',
  });
  const buttonPrevBeforeClick = await screen.findByRole('button', {
    name: 'Previous',
  });

  expect(buttonNextBeforeClick).toBeEnabled();
  expect(buttonPrevBeforeClick).toBeDisabled();

  fireEvent.click(buttonNextBeforeClick);

  const buttonNextAfterClick = await screen.findByRole('button', {
    name: 'Next',
  });
  const buttonPrevAfterClick = await screen.findByRole('button', {
    name: 'Previous',
  });

  expect(buttonNextAfterClick).toBeDisabled();
  expect(buttonPrevAfterClick).toBeEnabled();
});
