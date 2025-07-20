import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';
import type { ReactElement } from 'react';

function Thrower(): ReactElement {
  throw new Error('Boom!');
}

describe('ErrorBoundary', () => {
  it('displays children if everything is ok', () => {
    render(
      <ErrorBoundary>
        <div>Children</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('catches the error and shows the fallback-UI', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
    (console.error as jest.MockedFunction<typeof console.error>).mockRestore();
  });
});
