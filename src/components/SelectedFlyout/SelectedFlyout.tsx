import {
  type Item,
  useSelectedItemsStore,
} from '../../stores/SelectedItemsStore';

export const SelectedFlyout = () => {
  const selected = useSelectedItemsStore((state) => state.selected);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  const items = Object.values(selected);

  if (items.length === 0) {
    return null;
  }

  const downloadCsv = () => {
    const header = [
      propertyOf<Item>('id'),
      propertyOf<Item>('name'),
      propertyOf<Item>('detailsUrl'),
    ];

    const csvRows = items.map((i) => {
      return header.map((h) => `"${i[h] || ''}"`).join(',');
    });

    const csvContent = [header.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    a.download = `${items.length}_items.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed w-100 right bottom-0 left-0 right-0 bg-gray-700 text-white flex items-center p-4 z-50">
      <span data-testid="selected-count">
        {items.length} items are selected
      </span>
      <button className="ml-4" onClick={unselectAll}>
        Unselect all
      </button>
      <button className="ml-4" onClick={downloadCsv}>
        Download
      </button>
    </div>
  );
};

function propertyOf<TObj>(name: keyof TObj) {
  return name;
}
