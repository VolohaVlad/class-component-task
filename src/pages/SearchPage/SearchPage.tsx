import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { PokemonListItem } from '../../models/PokemonListItem';
import { ResultsList } from '../../components/ResultsList';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { DetailsPanel } from '../../components/DetailsPanel';
import { Tooltip } from '../../components/Tooltip';
import { SelectedFlyout } from '../../components/SelectedFlyout/SelectedFlyout';
import { useItems } from '../../hooks/useItems.ts';

const limit = 20;

export const SearchPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const detailsId = searchParams.get('details');
  const term = searchParams.get('term');

  if (isNaN(page)) {
    navigate('not-found');
  }

  const [searchTerm, setSearchTerm] = useLocalStorage<string>('pokeQuery', '');
  const [input, setInput] = useState<string>(searchTerm);

  const { data, isLoading, isError, error, refetch, isFetching } = useItems(
    page,
    term
  );

  const total = data?.count ?? 0;

  const handleChange = (val: string) => {
    setInput(val);
  };
  const handleSearch = () => {
    const trimmed = input.trim();

    setSearchTerm(trimmed);
    if (trimmed) {
      searchParams.set('term', trimmed);
    } else {
      searchParams.delete('term');
    }
    setSearchParams(searchParams);
  };

  const handleSelectDetails = (p: PokemonListItem) => {
    searchParams.set('details', p.name);
    setSearchParams(searchParams);
  };

  const handleCloseDetails = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      searchParams.set('page', String(page - 1));
      setSearchParams(searchParams);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(total / limit);
    if (page < maxPage) {
      searchParams.set('page', String(page + 1));
      setSearchParams(searchParams);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900  dark:text-slate-100">
        <div className="max-w-5xl mx-auto mt-8 px-4 dark:bg-slate-900">
          <div className="flex justify-between mb-6">
            <h1 className="font-bold text-2xl">Pokémon browser</h1>
            <Link
              className="text-blue-700 dark:text-white hover:underline"
              to="/about"
            >
              About
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <SearchBar
              value={input}
              onSearch={handleSearch}
              onChange={handleChange}
              isFetching={isFetching}
              onRefresh={() => refetch()}
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
                pokemons={data?.results}
                loading={isLoading}
                isError={isError}
                error={error}
                onSelect={handleSelectDetails}
                selectedId={detailsId}
              />
              {!isLoading && !error && total / limit > 1 && (
                <Pagination
                  page={page}
                  total={Math.max(1, Math.ceil(total / limit))}
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />
              )}
            </div>
            {detailsId && (
              <div className="flex-1 max-w-xl shadow-md bg-white dark:bg-slate-700 rounded-md border p-3 relative">
                <DetailsPanel
                  detailsId={detailsId}
                  onClose={handleCloseDetails}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SelectedFlyout />
    </>
  );
};
