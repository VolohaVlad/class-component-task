import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardList from './CardList';
import type { CardProps } from './Card';

jest.mock(
  './Card.tsx',
  () =>
    function Card({ name, description }: CardProps) {
      return (
        <div data-testid="card">
          <span>{name}</span>
          <span>{description}</span>
        </div>
      );
    }
);

describe('CardList', () => {
  it('render Card for each element', () => {
    const items = [
      { name: 'One', description: 'First' },
      { name: 'Two', description: 'Second' },
    ];
    render(<CardList items={items} />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('One');
    expect(cards[0]).toHaveTextContent('First');
    expect(cards[1]).toHaveTextContent('Two');
    expect(cards[1]).toHaveTextContent('Second');
  });

  it('show if no result', () => {
    render(<CardList items={[]} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.queryAllByTestId('card')).toHaveLength(0);
  });
});
