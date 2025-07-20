import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('displays the current page and the total number of pages', () => {
    render(
      <Pagination page={2} total={7} onPrev={() => {}} onNext={() => {}} />
    );
    expect(screen.getByText(/Page 2 \/ 7/i)).toBeInTheDocument();
  });

  it('"Previous" button is disabled on the first page', () => {
    render(
      <Pagination page={1} total={5} onPrev={() => {}} onNext={() => {}} />
    );
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).not.toBeDisabled();
  });

  it('"Next" button is disabled on the last page', () => {
    render(
      <Pagination page={5} total={5} onPrev={() => {}} onNext={() => {}} />
    );
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).not.toBeDisabled();
  });

  it('calls onPrev and onNext on click', () => {
    const prevMock = jest.fn();
    const nextMock = jest.fn();
    render(
      <Pagination page={3} total={5} onPrev={prevMock} onNext={nextMock} />
    );
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(prevMock).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(nextMock).toHaveBeenCalled();
  });
});
