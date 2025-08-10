import get from 'axios';
import type { PokemonListResponse } from '../models/PokemonListResponse';
import type { PokemonDetails } from '../models/PokemonDetails.ts';

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
      throw new Error('Failed to load list');
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
      throw new Error('Pokemon not found');
    }
  }

  async details(detailsId: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${detailsId}`;
    try {
      const { data } = await get<PokemonDetails>(url);
      return data;
    } catch {
      throw new Error('Pokemon not found');
    }
  }
}
