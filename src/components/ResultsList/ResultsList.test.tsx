import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ResultsList } from './ResultsList';
import type { PokemonListItem } from '../../models/PokemonListItem';

describe('ResultsList', () => {
  const pokemons: PokemonListItem[] = [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  ];
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders spinner when loading', () => {
    render(
      <ResultsList
        pokemons={[]}
        loading={true}
        error={null}
        isError={false}
        onSelect={onSelect}
      />
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message if error present', () => {
    render(
      <ResultsList
        pokemons={[]}
        loading={false}
        error={new Error('Something wrong')}
        isError={true}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('Something wrong')).toBeInTheDocument();
  });

  it('renders "No results." if no pokemons and not loading, not error', () => {
    render(
      <ResultsList
        pokemons={[]}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it('renders list of pokemons when provided', () => {
    render(
      <ResultsList
        pokemons={pokemons}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
      />
    );
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/Bulbasaur/i)).toBeInTheDocument();
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    );
    expect(imgs[1]).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    );
  });

  it('calls onSelect when row is clicked', () => {
    render(
      <ResultsList
        pokemons={pokemons}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
      />
    );
    const pikachuItem = screen.getAllByTestId('result-item-select')[0];
    fireEvent.click(pikachuItem);
    expect(onSelect).toHaveBeenCalledWith(pokemons[0]);
  });

  it('applies bg-blue-100 if item selected by name (case-insensitive)', () => {
    render(
      <ResultsList
        pokemons={pokemons}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
        selectedId="PIKACHU"
      />
    );
    const pikachuItem = screen.getAllByTestId('result-item')[0];
    expect(pikachuItem.className).toContain('bg-blue-100');
  });

  it('applies bg-blue-100 if item selected by id in url', () => {
    render(
      <ResultsList
        pokemons={pokemons}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
        selectedId="25"
      />
    );
    const pikachuItem = screen.getAllByTestId('result-item')[0];
    expect(pikachuItem.className).toContain('bg-blue-100');
  });

  it('does not apply bg-blue-100 if selectedId is not matching', () => {
    render(
      <ResultsList
        pokemons={pokemons}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
        selectedId="777"
      />
    );
    const items = screen.getAllByTestId('result-item');
    expect(items[0].className).not.toContain('bg-blue-100');
    expect(items[1].className).not.toContain('bg-blue-100');
  });

  it('handles pokeId ending with .png', () => {
    const pokemonsWithJpg: PokemonListItem[] = [
      { name: 'special', url: 'https://pokeapi.co/api/v2/pokemon/150.png' },
    ];
    render(
      <ResultsList
        pokemons={pokemonsWithJpg}
        loading={false}
        error={null}
        isError={false}
        onSelect={onSelect}
      />
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png'
    );
  });
});
