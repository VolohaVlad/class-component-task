import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: (_: string, val: string) => [val, jest.fn()],
}));

jest.mock('../../services/PokemonService');

import { PokemonService } from '../../services/PokemonService';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders heading and fetches a list', async () => {
    (PokemonService as jest.Mock).mockImplementation(() => ({
      list: jest.fn().mockResolvedValue({
        results: [{ name: 'pikachu', url: 'url' }],
        count: 1,
      }),
      search: jest.fn(),
      details: jest.fn(),
    }));

    render(
      <MemoryRouter
        initialEntries={['/1']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/:page" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Pokémon browser/i)).toBeInTheDocument();
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });

  it('displays error when list fails', async () => {
    (PokemonService as jest.Mock).mockImplementation(() => ({
      list: jest.fn().mockResolvedValue({ message: 'Failed!' }),
      search: jest.fn(),
      details: jest.fn(),
    }));

    render(
      <MemoryRouter
        initialEntries={['/1']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/:page" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Failed!/i)).toBeInTheDocument();
  });
});
