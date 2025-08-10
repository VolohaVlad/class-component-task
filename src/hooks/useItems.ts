import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PokemonService } from '../services/PokemonService.ts';

export function useItems(page: number, term: string | null) {
  const [service] = useState(new PokemonService());

  return useQuery({
    queryKey: ['items', page, term],
    queryFn: async () => {
      return term ? service.search(term) : await service.list(page);
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
