import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card component', () => {
  it('displays name and description', () => {
    const { getByText } = render(
      <Card name="Bulbasaur" description="Grass/Poison" />
    );
    expect(getByText('Bulbasaur')).toBeInTheDocument();
    expect(getByText('Grass/Poison')).toBeInTheDocument();
  });
});
