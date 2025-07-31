import React from 'react';
import type { PokemonListItem } from '../../models/PokemonListItem.ts';

type Props = {
  pokemons: PokemonListItem[];
  loading: boolean;
  error: string | null;
  onSelect: (p: PokemonListItem) => void;
  selectedId?: string;
};

export const ResultsList: React.FC<Props> = ({
  pokemons,
  loading,
  error,
  onSelect,
  selectedId,
}) => (
  <div className="bg-white rounded p-3 shadow-sm mb-3 min-h-[160px]">
    {loading && <div data-testid="spinner">Loading…</div>}
    {error && <div className="text-red-500">{error}</div>}
    {!loading && !error && pokemons.length === 0 && <div>No results.</div>}
    {!loading &&
      !error &&
      pokemons.map((p) => {
        let pokeId = p.url.split('/').filter(Boolean).pop() ?? '';
        if (pokeId.endsWith('.png')) {
          pokeId = pokeId.replace('.png', '');
        }
        const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
        return (
          <div
            key={p.name}
            className={`flex items-center border-b last:border-none p-2 cursor-pointer hover:bg-blue-50 rounded transition font-sans ${selectedId?.toLowerCase() === p.name.toLowerCase() || selectedId === pokeId ? 'bg-blue-100' : ''}`}
            onClick={() => onSelect(p)}
            data-testid="result-item"
          >
            <img
              src={img}
              alt={p.name}
              width={36}
              height={36}
              className="mr-3"
            />
            <div className="capitalize font-semibold">{p.name}</div>
          </div>
        );
      })}
  </div>
);
export default ResultsList;
