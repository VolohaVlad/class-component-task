import { useDetailsItem } from '../../hooks/useDetailsItem.ts';

type Props = {
  detailsId: string;
  onClose: () => void;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const DetailsPanel = ({ detailsId, onClose }: Props) => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDetailsItem(detailsId);

  return (
    <div>
      <button
        className="absolute top-2 right-3 text-gray-400 text-xl"
        title="Close"
        onClick={onClose}
      >
        &#10005;
      </button>
      <div className="font-bold text-lg mb-2 capitalize flex gap-1">
        <span>Pokémon details</span>
        <button
          className="text-gray-400 text-xl"
          title="Close"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {isLoading && <div>Loading details...</div>}
      {isError && error ? (
        <div className="text-red-500">{error.message}</div>
      ) : !isLoading && data ? (
        <>
          <div className="flex items-center mb-3">
            <img
              src={data.sprites?.other?.['official-artwork']?.front_default}
              alt={data.name}
              width={96}
              height={96}
              className="mr-4"
            />
            <div>
              <div>
                <b>Name:</b> {capitalize(data.name)}
              </div>
              <div>
                <b>ID:</b> {data.id}
              </div>
            </div>
          </div>
          <div className="mb-2">
            <b>Types:</b>{' '}
            {data.types.map((t) => capitalize(t.type.name)).join(', ')}
          </div>
          <div className="mb-2">
            <b>Height:</b> {data.height / 10} m
          </div>
          <div className="mb-2">
            <b>Weight:</b> {data.weight / 10} kg
          </div>
          <div>
            <b>Abilities:</b>{' '}
            {data.abilities.map((a) => capitalize(a.ability.name)).join(', ')}
          </div>
        </>
      ) : null}
    </div>
  );
};
