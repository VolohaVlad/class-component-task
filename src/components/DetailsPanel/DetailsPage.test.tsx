import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsPanel } from './DetailsPanel';
import { useDetailsItem } from '../../hooks/useDetailsItem';

jest.mock('../../hooks/useDetailsItem');

const mockedUseDetailsItem = useDetailsItem as jest.Mock;

const mockOnClose = jest.fn();
const mockRefetch = jest.fn();

const mockData = {
  name: 'pikachu',
  id: 25,
  height: 4,
  weight: 60,
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu.png',
      },
    },
  },
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
};

describe('DetailsPanel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockedUseDetailsItem.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);
    expect(screen.getByText(/Loading details.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockedUseDetailsItem.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch' },
      refetch: mockRefetch,
      isFetching: false,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it('renders Pokémon details', async () => {
    mockedUseDetailsItem.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);

    expect((await screen.findByText(/Name:/i)).parentElement).toHaveTextContent(
      /Pikachu/i
    );
    expect((await screen.findByText(/ID:/i)).parentElement).toHaveTextContent(
      'ID: 25'
    );
    expect(
      (await screen.findByText(/Types:/i)).parentElement
    ).toHaveTextContent('Types: Electric');
    expect(
      (await screen.findByText(/Height:/i)).parentElement
    ).toHaveTextContent('Height: 0.4 m');
    expect(
      (await screen.findByText(/Weight:/i)).parentElement
    ).toHaveTextContent('Weight: 6 kg');
    expect(
      (await screen.findByText(/Abilities:/i)).parentElement
    ).toHaveTextContent('Abilities: Static, Lightning-rod');
  });

  it('calls onClose when close button is clicked', async () => {
    mockedUseDetailsItem.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);
    fireEvent.click(await screen.findByTitle('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls refetch when refresh button is clicked', () => {
    mockedUseDetailsItem.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('disables refresh button when isFetching is true', () => {
    mockedUseDetailsItem.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: true,
    });

    render(<DetailsPanel detailsId="25" onClose={mockOnClose} />);
    const refreshButton = screen.getByText('Refreshing...');
    expect(refreshButton).toBeDisabled();
  });
});
