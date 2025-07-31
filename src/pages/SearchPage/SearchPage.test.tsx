import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Подменяем useLocalStorage, чтобы не было побочных эффектов
jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: (_: string, val: string) => [val, jest.fn()],
}));

jest.mock('../../services/PokemonService'); // Мокаем класс!

import { PokemonService } from '../../services/PokemonService';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  beforeEach(() => {
    // сбрасываем моки между тестами
    jest.resetAllMocks();
  });

  it('renders heading and fetches a list', async () => {
    // Настраиваем что mock возвращает
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

    // Проверяем, что заголовок есть
    expect(screen.getByText(/Pokémon browser/i)).toBeInTheDocument();

    // — findByText ждет появления после асинхронного запроса:
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });

  it('displays error when list fails', async () => {
    (PokemonService as jest.Mock).mockImplementation(() => ({
      list: jest.fn().mockResolvedValue({ message: 'Failed!' }), // ServiceError
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
