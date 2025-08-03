import {
  type Item,
  useSelectedItemsStore,
} from '../../stores/SelectedItemsStore';
import { type ChangeEvent, useCallback } from 'react';

type CheckboxProps = {
  item: Item;
};

export const Checkbox = ({ item }: CheckboxProps) => {
  const selected = useSelectedItemsStore((state) => state.selected);
  const select = useSelectedItemsStore((state) => state.selectItem);
  const unselect = useSelectedItemsStore((state) => state.unselectItem);

  const checked = !!selected[item.id];

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        select(item);
      } else {
        unselect(item.id);
      }
    },
    [select, unselect, item]
  );

  return <input type="checkbox" checked={checked} onChange={handleOnChange} />;
};
