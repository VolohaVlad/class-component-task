import '@testing-library/jest-dom';
import { PokemonService } from './PokemonService';
import get from 'axios';

jest.mock('axios');
const mockedGet = get as jest.MockedFunction<typeof get>;

describe('PokemonService', () => {
  let service: PokemonService;
  beforeEach(() => {
    service = new PokemonService();
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return pokemon list on success', async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          results: [{ name: 'bulbasaur', url: 'url1' }],
          count: 1,
        },
      });

      const res = await service.list(1, 1);
      expect(mockedGet).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1&offset=0'
      );
      expect(res).toEqual({
        results: [{ name: 'bulbasaur', url: 'url1' }],
        count: 1,
      });
    });

    it('throws error when list fetch fails', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Network error'));

      await expect(service.list()).rejects.toThrow('Failed to load list');
    });
  });

  describe('search', () => {
    it('should return one pokemon on success', async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          name: 'pikachu',
          sprites: {
            other: { 'official-artwork': { front_default: 'img-url' } },
          },
        },
      } as never);

      const res = await service.search('pikachu');
      expect(mockedGet).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(res).toEqual({
        results: [{ name: 'pikachu', url: 'img-url' }],
        count: 1,
      });
    });

    it('throws error when Pokémon not found', async () => {
      mockedGet.mockRejectedValueOnce(new Error('404'));

      await expect(service.search('unknown')).rejects.toThrow(
        'Pokemon not found'
      );
    });

    it('should use empty string url if sprite is missing', async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          name: 'ditto',
          sprites: {},
        },
      } as never);

      const res = await service.search('ditto');
      expect(res).toEqual({
        results: [{ name: 'ditto', url: '' }],
        count: 1,
      });
    });
  });

  describe('details', () => {
    it('should return details on success', async () => {
      mockedGet.mockResolvedValueOnce({
        data: { id: 1, name: 'bulbasaur' },
      });
      const res = await service.details('1');
      expect(mockedGet).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      expect(res).toEqual({ id: 1, name: 'bulbasaur' });
    });

    it('throws error when details fetch fails', async () => {
      mockedGet.mockRejectedValueOnce(new Error('404'));

      await expect(service.details('9999')).rejects.toThrow(
        'Pokemon not found'
      );
    });
  });
});
