import type { PokemonAbility } from './PokemonAbility.ts';

export interface PokemonDetailsResponse {
  name: string;
  abilities: PokemonAbility[];
}
