import { renderHook, waitFor } from '@testing-library/react';
import { useDetailsItem } from './useDetailsItem';
import { PokemonService } from '../services/PokemonService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

jest.mock('../services/PokemonService');
const MockedPokemonService = PokemonService as jest.MockedClass<
  typeof PokemonService
>;

const createWrapper = () => {
  const queryClient = new QueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientTestWrapper';

  return Wrapper;
};

describe('useDetailsItem', () => {
  const mockDetails = {
    name: 'bulbasaur',
    id: 1,
    height: 7,
    weight: 69,
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://example.com/bulbasaur.png',
        },
      },
    },
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    abilities: [{ ability: { name: 'overgrow' } }],
    url: 'some-url',
  };

  beforeEach(() => {
    MockedPokemonService.mockClear();
  });

  it('returns Pokémon details on success', async () => {
    MockedPokemonService.prototype.details.mockResolvedValueOnce(mockDetails);

    const { result } = renderHook(() => useDetailsItem('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockDetails);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
});
