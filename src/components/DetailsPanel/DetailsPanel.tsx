import { useEffect, useState } from 'react';
import type { PokemonService } from '../../services/PokemonService';
import { isServiceError } from '../../utils.ts';
import type { PokemonDetails } from '../../models/PokemonDetails.ts';

type Props = {
  detailsId: string;
  pokemonService: PokemonService;
  onClose: () => void;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const DetailsPanel = ({ detailsId, pokemonService, onClose }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PokemonDetails | undefined>();

  useEffect(() => {
    setLoading(true);
    pokemonService
      .details(detailsId)
      .then((data) => {
        if (isServiceError(data)) {
          setError(data.message);
        } else {
          setDetails(data);
        }
      })
      .catch(() => setError('Failed to load pokemon list'))
      .finally(() => setLoading(false));
  }, [setLoading, setError, setDetails, pokemonService, detailsId]);

  return (
    <div>
      <button
        className="absolute top-2 right-3 text-gray-400 text-xl"
        title="Close"
        onClick={onClose}
      >
        &#10005;
      </button>
      <div className="font-bold text-lg mb-2 capitalize">Pokémon details</div>
      {loading && <div>Loading details...</div>}
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : !loading && details ? (
        <>
          <div className="flex items-center mb-3">
            <img
              src={details.sprites?.other?.['official-artwork']?.front_default}
              alt={details.name}
              width={96}
              height={96}
              className="mr-4"
            />
            <div>
              <div>
                <b>Name:</b> {capitalize(details.name)}
              </div>
              <div>
                <b>ID:</b> {details.id}
              </div>
            </div>
          </div>
          <div className="mb-2">
            <b>Types:</b>{' '}
            {details.types.map((t) => capitalize(t.type.name)).join(', ')}
          </div>
          <div className="mb-2">
            <b>Height:</b> {details.height / 10} m
          </div>
          <div className="mb-2">
            <b>Weight:</b> {details.weight / 10} kg
          </div>
          <div>
            <b>Abilities:</b>{' '}
            {details.abilities
              .map((a) => capitalize(a.ability.name))
              .join(', ')}
          </div>
        </>
      ) : null}
    </div>
  );
};
