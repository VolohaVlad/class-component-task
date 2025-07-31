import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsPanel } from './DetailsPanel';
import type { PokemonService } from '../../services/PokemonService';
import type { PokemonDetails } from '../../models/PokemonDetails';

const mockDetails = jest.fn();
const pokemonService: PokemonService = {
  details: mockDetails,
  list: mockDetails,
  search: mockDetails,
};

const onClose = jest.fn();

const sampleDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  url: 'pikachu',
  height: 40,
  weight: 60,
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://pokeapi.co/artwork/pikachu.png',
      },
    },
  },
};

describe('DetailsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading on initial render', async () => {
    mockDetails.mockReturnValue(new Promise(() => {})); // never resolves
    render(
      <DetailsPanel
        detailsId="25"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );
    expect(await screen.findByText(/loading details/i)).toBeInTheDocument();
  });

  it('fetches and displays details on success', async () => {
    mockDetails.mockResolvedValueOnce(sampleDetails);

    render(
      <DetailsPanel
        detailsId="25"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );

    // Ждет покемона по завершении анмаунта
    expect(await screen.findByText(/Name:/)).toBeInTheDocument();
    expect(await screen.findByText(/Pikachu/)).toBeInTheDocument();
    expect((await screen.findByText(/ID:/i)).parentElement).toHaveTextContent(
      '25'
    );
    expect((await screen.findByText(/Types:/)).parentElement).toHaveTextContent(
      'Electric'
    );
    expect(
      (await screen.findByText(/Height:/)).parentElement
    ).toHaveTextContent('4 m');
    expect(
      (await screen.findByText(/Weight:/)).parentElement
    ).toHaveTextContent('6 kg');
    expect(
      (await screen.findByText(/Abilities:/)).parentElement
    ).toHaveTextContent('Static, Lightning-rod');
    // Проверим картинку
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      sampleDetails.sprites.other?.['official-artwork']?.front_default
    );
  });

  it('shows service error', async () => {
    mockDetails.mockResolvedValueOnce({ message: 'No such pokemon' });
    render(
      <DetailsPanel
        detailsId="999"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );
    expect(await screen.findByText(/no such pokemon/i)).toBeInTheDocument();
  });

  it('shows catch error (network)', async () => {
    mockDetails.mockRejectedValueOnce(new Error('Network failed'));
    render(
      <DetailsPanel
        detailsId="25"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );

    expect(
      await screen.findByText(/failed to load pokemon list/i)
    ).toBeInTheDocument();
  });

  it('calls onClose on close button', async () => {
    mockDetails.mockResolvedValueOnce(sampleDetails);
    render(
      <DetailsPanel
        detailsId="25"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );
    fireEvent.click(await screen.findByTitle(/close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('requests details for new id if id changes', async () => {
    mockDetails.mockResolvedValueOnce(sampleDetails);

    const { rerender } = render(
      <DetailsPanel
        detailsId="25"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );

    await screen.findByText(/pikachu/i);
    expect(mockDetails).toHaveBeenCalledWith('25');

    mockDetails.mockResolvedValueOnce({
      ...sampleDetails,
      id: 26,
      name: 'raichu',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://pokeapi.co/artwork/raichu.png',
          },
        },
      },
    });

    rerender(
      <DetailsPanel
        detailsId="26"
        pokemonService={pokemonService}
        onClose={onClose}
      />
    );

    // дожидаемся появления деталей для 26
    await screen.findByText(/raichu/i);
    expect(mockDetails).toHaveBeenCalledWith('26');
  });
});
