import { useSelectedItemsStore } from '../../stores/SelectedItemsStore';
import { CSVLink } from 'react-csv';

export const SelectedFlyout = () => {
  const selected = useSelectedItemsStore((state) => state.selected);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  const items = Object.values(selected);

  if (items.length === 0) {
    return null;
  }

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Details URL', key: 'detailsUrl' },
  ];

  return (
    <div className="fixed w-100 right bottom-0 left-0 right-0 bg-gray-700 text-white flex items-center p-4 z-50">
      <span data-testid="selected-count">
        {items.length} items are selected
      </span>
      <button className="ml-4" onClick={unselectAll}>
        Unselect all
      </button>
      <CSVLink
        data={items}
        headers={headers}
        filename={`${items.length}_items.csv`}
        className="ml-4 bg-blue-500 px-3 py-1 text-white rounded hover:bg-blue-600"
      >
        Download
      </CSVLink>
    </div>
  );
};
