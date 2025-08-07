import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PokemonService } from '../services/PokemonService.ts';

export function useDetailsItem(detailsId: string) {
  const [service] = useState(new PokemonService());

  return useQuery({
    queryKey: ['details', detailsId],
    queryFn: async () => {
      return await service.details(detailsId);
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
