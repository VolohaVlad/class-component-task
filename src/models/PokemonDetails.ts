import type { PokemonAbility } from './PokemonAbility.ts';

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonStripe {
  other?: {
    'official-artwork'?: {
      front_default?: string;
    };
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  abilities: PokemonAbility[];
  weight: number;
  height: number;
  types: PokemonType[];
  sprites: PokemonStripe;
  url: string;
}
