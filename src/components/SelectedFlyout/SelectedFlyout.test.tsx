import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedFlyout } from './SelectedFlyout';
import { useSelectedItemsStore } from '../../stores/SelectedItemsStore';

let clickMock: jest.Mock;
let setHref: string | undefined;
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:url');
  global.URL.revokeObjectURL = jest.fn();
  window.HTMLAnchorElement.prototype.click = clickMock = jest.fn();
  Object.defineProperty(window.HTMLAnchorElement.prototype, 'href', {
    set(value) {
      setHref = value;
    },
    get() {
      return setHref;
    },
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

beforeEach(() => {
  useSelectedItemsStore.setState({ selected: {} });
  clickMock.mockClear();
  setHref = undefined;
});

function addMockItems(n: number = 3) {
  const { selectItem } = useSelectedItemsStore.getState();
  [...Array(n).keys()].forEach((i) => {
    selectItem({
      id: String(i + 1),
      name: 'Item ' + (i + 1),
      detailsUrl: 'http://example.com/' + (i + 1),
    });
  });
}

describe('SelectedFlyout', () => {
  it('absent if nothing is selected', () => {
    render(<SelectedFlyout />);
    expect(screen.queryByTestId('selected-count')).not.toBeInTheDocument();
    expect(screen.queryByText(/Unselect all/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download/i)).not.toBeInTheDocument();
  });

  it('displays the number of selected', () => {
    addMockItems(2);
    render(<SelectedFlyout />);
    expect(screen.getByTestId('selected-count')).toHaveTextContent(
      '2 items are selected'
    );
    expect(screen.getByText(/Unselect all/i)).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
  });

  it('The Unselect all button clears the selection and hides', async () => {
    addMockItems(2);
    render(<SelectedFlyout />);
    expect(screen.getByTestId('selected-count')).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Unselect all/i));
    expect(screen.queryByTestId('selected-count')).not.toBeInTheDocument();
  });

  it('The Download button causes the CSV to be saved', async () => {
    addMockItems(2);
    render(<SelectedFlyout />);
    setHref = undefined;
    await userEvent.click(screen.getByText(/Download/i));
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(setHref).toBe('blob:url');
  });

  it('The downloaded CSV contains correct data', async () => {
    addMockItems(1);
    render(<SelectedFlyout />);
    let actualBlob: Blob | MediaSource | undefined;
    global.URL.createObjectURL = jest.fn((blob) => {
      actualBlob = blob;
      return 'blob:url';
    });
    await userEvent.click(screen.getByText(/Download/i));
    expect(actualBlob).toBeDefined();
    if (actualBlob instanceof Blob) {
      const text = await actualBlob.text();
      expect(text).toMatch(/^id,name,detailsUrl\n/);
      expect(text).toMatch(/"1","Item 1","http:\/\/example\.com\/1"/);
    }
  });
});
