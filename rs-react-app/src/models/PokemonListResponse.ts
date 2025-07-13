import type { PokemonListItem } from './PokemonListItem.ts';

export interface PokemonListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PokemonListItem[];
}
