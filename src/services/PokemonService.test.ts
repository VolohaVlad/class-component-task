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

    it('should return ServiceError on error', async () => {
      mockedGet.mockRejectedValueOnce(new Error('fail'));
      const res = await service.list(2, 5);
      expect(res).toEqual({ message: 'Failed to load list' });
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

    it('should return ServiceError if not found', async () => {
      mockedGet.mockRejectedValueOnce(new Error('nope'));
      const res = await service.search('unknown');
      expect(res).toEqual({ message: 'Pokemon not found' });
    });

    it('should use empty string url if sprite is missing', async () => {
      mockedGet.mockResolvedValueOnce({
        data: {
          name: 'ditto',
          sprites: {}, // missing sprites.other etc
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

    it('should return ServiceError on error', async () => {
      mockedGet.mockRejectedValueOnce(new Error('fail'));
      const res = await service.details('42');
      expect(res).toEqual({ message: 'Pokemon not found' });
    });
  });
});
