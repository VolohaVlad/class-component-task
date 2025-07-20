import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

describe('Loader', () => {
  it('show spin and text "Loading..."', () => {
    render(<Loader />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
