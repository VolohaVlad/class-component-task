import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders input with given value', () => {
    render(
      <SearchBar value="Pikachu" onChange={() => {}} onSearch={() => {}} />
    );
    const input = screen.getByPlaceholderText(
      /search pokemon/i
    ) as HTMLInputElement;
    expect(input.value).toBe('Pikachu');
  });

  it('calls onChange when typing in the input', () => {
    const handleChange = jest.fn();
    render(<SearchBar value="" onChange={handleChange} onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/search pokemon/i);
    fireEvent.change(input, { target: { value: 'Charizard' } });
    expect(handleChange).toHaveBeenCalledWith('Charizard');
  });

  it('calls onSearch when clicking the Search button', () => {
    const handleSearch = jest.fn();
    render(<SearchBar value="" onChange={() => {}} onSearch={handleSearch} />);
    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);
    expect(handleSearch).toHaveBeenCalled();
  });

  it('calls onSearch when pressing Enter in the input', () => {
    const handleSearch = jest.fn();
    render(<SearchBar value="" onChange={() => {}} onSearch={handleSearch} />);
    const input = screen.getByPlaceholderText(/search pokemon/i);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(handleSearch).toHaveBeenCalled();
  });
});
