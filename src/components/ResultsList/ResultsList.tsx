import React from 'react';
import type { PokemonListItem } from '../../models/PokemonListItem.ts';
import { Checkbox } from '../Checkbox';

type Props = {
  pokemons?: PokemonListItem[];
  loading: boolean;
  isError: boolean;
  error: Error | null;
  onSelect: (p: PokemonListItem) => void;
  selectedId?: string | null;
};

export const ResultsList: React.FC<Props> = ({
  pokemons,
  loading,
  isError,
  error,
  onSelect,
  selectedId,
}) => (
  <div className="bg-white dark:bg-slate-700 rounded p-3 shadow-sm mb-3 min-h-[160px]">
    {loading && <div data-testid="spinner">Loading…</div>}
    {isError && error && <div className="text-red-500">{error.message}</div>}
    {!loading &&
      !error &&
      (!pokemons?.length ? (
        <div>No results.</div>
      ) : (
        pokemons.map((p) => {
          let pokeId = p.url.split('/').filter(Boolean).pop() ?? '';
          if (pokeId.endsWith('.png')) {
            pokeId = pokeId.replace('.png', '');
          }
          const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
          return (
            <div
              key={p.name}
              data-testid="result-item"
              className={`flex items-center hover:bg-blue-50 dark:hover:bg-blue-800 ${selectedId?.toLowerCase() === p.name.toLowerCase() || selectedId === pokeId ? 'bg-blue-100 dark:bg-black' : ''}`}
            >
              <div>
                <Checkbox
                  item={{ id: p.name, name: p.name, detailsUrl: p.url }}
                />
              </div>
              <div
                className="flex items-center border-b last:border-none p-2 cursor-pointer rounded transition font-sans"
                onClick={() => onSelect(p)}
                data-testid="result-item-select"
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
            </div>
          );
        })
      ))}
  </div>
);
