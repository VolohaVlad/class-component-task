import { type ChangeEvent, type KeyboardEvent, useCallback } from 'react';

interface SearchBarProps {
  value: string | null;
  onChange: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  onSearch: () => void;
}

export const SearchBar = ({
  value,
  onSearch,
  onChange,
  isFetching,
  onRefresh,
}: SearchBarProps) => {
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <div className="flex gap-2 items-center">
      <input
        className="border px-4 py-2 rounded w-64"
        type="text"
        value={value ?? ''}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Search Pokemon..."
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={onSearch}
      >
        Search
      </button>
      <button
        onClick={onRefresh}
        disabled={isFetching}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};
