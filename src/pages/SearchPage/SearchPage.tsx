import { useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from 'react-router-dom';

import { PokemonService } from '../../services/PokemonService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { PokemonListItem } from '../../models/PokemonListItem';
import { ResultsList } from '../../components/ResultsList';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { DetailsPanel } from '../../components/DetailsPanel';
import { isServiceError } from '../../utils.ts';
import { Tooltip } from '../../components/Tooltip';

const limit = 20;

export const SearchPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [searchParams] = useSearchParams();
  const term = searchParams.get('term');

  const [pokemonService] = useState(new PokemonService());

  const page = Number(params.page ?? 1);
  if (isNaN(page)) {
    navigate('not-found');
  }

  const [searchTerm, setSearchTerm] = useLocalStorage<string>('pokeQuery', '');
  const [input, setInput] = useState<string>(searchTerm);

  const detailsId = params.detailsId || '';

  const [total, setTotal] = useState(0);
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const res = term ? pokemonService.search(term) : pokemonService.list(page);
    res
      .then((data) => {
        if (isServiceError(data)) {
          setError(data.message);
        } else {
          setPokemons(data.results ?? []);
          setTotal(data.count || 0);
        }
      })
      .catch(() => setError('Failed to load pokemon list'))
      .finally(() => setLoading(false));
  }, [setPokemons, setLoading, setError, pokemonService, page, term]);

  // Handlers
  const handleChange = (val: string) => {
    setInput(val);
  };
  const handleSearch = () => {
    const trimmed = input.trim();

    setSearchTerm(trimmed);
    if (trimmed) {
      navigate(`/1?term=${input.trim()}`);
    } else {
      navigate('/1');
    }
  };

  const handleSelectDetails = (p: PokemonListItem) => {
    const trimmed = input.trim();
    if (trimmed) {
      navigate(`/${page}/${p.name}?term=${input.trim()}`);
    } else {
      navigate(`/${page}/${p.name}`);
    }
  };
  const handleCloseDetails = () => {
    const trimmed = input.trim();
    if (trimmed) {
      navigate(`/${page}?term=${input.trim()}`);
    } else {
      navigate(`/${page}`);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      navigate(`/${page - 1}${detailsId ? `/${detailsId}` : ''}`);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(total / limit);
    if (page < maxPage) {
      navigate(`/${page + 1}${detailsId ? `/${detailsId}` : ''}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="flex justify-between mb-6">
          <h1 className="font-bold text-2xl">Pokémon browser</h1>
          <Link className="text-blue-700 hover:underline" to="/about">
            About
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <SearchBar
            value={input}
            onSearch={handleSearch}
            onChange={handleChange}
          />
          <Tooltip text="The search is performed by a complete match of the Pokemon name">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <text
                x="10"
                y="15"
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
              >
                ?
              </text>
            </svg>
          </Tooltip>
        </div>

        <div className={`flex gap-4 transition-all flex-col md:flex-row`}>
          <div className={`flex-1`}>
            <ResultsList
              pokemons={pokemons}
              loading={loading}
              error={error}
              onSelect={handleSelectDetails}
              selectedId={detailsId}
            />
            {!loading && !error && total / limit > 1 && (
              <Pagination
                page={page}
                total={Math.max(1, Math.ceil(total / limit))}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            )}
          </div>
          {detailsId && (
            <div className="flex-1 max-w-xl shadow-md bg-white rounded-md border p-3 relative">
              <DetailsPanel
                pokemonService={pokemonService}
                detailsId={detailsId}
                onClose={handleCloseDetails}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
