import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import {
  useSelectedItemsStore,
  type Item,
} from '../../stores/SelectedItemsStore';

const testItem: Item = {
  id: '1',
  name: 'Test Item',
  detailsUrl: '/some-url',
};

beforeEach(() => {
  useSelectedItemsStore.setState({ selected: {} });
});

describe('Checkbox', () => {
  it('not selected by default if not in selected', () => {
    render(<Checkbox item={testItem} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('selected if present in selected', () => {
    useSelectedItemsStore.setState({
      selected: { [testItem.id]: testItem },
    });
    render(<Checkbox item={testItem} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('on click calls selectItem if not selected', async () => {
    render(<Checkbox item={testItem} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    const { selected } = useSelectedItemsStore.getState();
    expect(selected[testItem.id]).toEqual(testItem);

    expect(checkbox).toBeChecked();
  });

  it('on re-click calls unselectItem', async () => {
    useSelectedItemsStore.setState({
      selected: { [testItem.id]: testItem },
    });
    render(<Checkbox item={testItem} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);

    const { selected } = useSelectedItemsStore.getState();
    expect(selected[testItem.id]).toBeUndefined();

    expect(checkbox).not.toBeChecked();
  });
});
