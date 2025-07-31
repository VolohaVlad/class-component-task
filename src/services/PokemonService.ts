import get from 'axios';
import type { PokemonListResponse } from '../models/PokemonListResponse';
import type { PokemonDetails } from '../models/PokemonDetails.ts';
import type { ServiceError } from '../models/ServiceError';

export class PokemonService {
  async list(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
      const listResponse = await get<PokemonListResponse>(url);

      const { results, count } = listResponse.data;

      return {
        results,
        count,
      };
    } catch {
      return {
        message: 'Failed to load list',
      } as ServiceError;
    }
  }

  async search(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    try {
      const { data } = await get<PokemonDetails>(url);
      return {
        results: [
          {
            name: data.name,
            url: data.sprites.other?.['official-artwork']?.front_default ?? '',
          },
        ],
        count: 1,
      };
    } catch {
      return {
        message: 'Pokemon not found',
      } as ServiceError;
    }
  }

  async details(detailsId: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${detailsId}`;
    try {
      const { data } = await get<PokemonDetails>(url);
      return data;
    } catch {
      return {
        message: 'Pokemon not found',
      } as ServiceError;
    }
  }
}
