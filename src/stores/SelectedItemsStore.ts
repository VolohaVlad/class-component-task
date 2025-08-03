import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Item = {
  id: string;
  name: string;
  detailsUrl?: string;
};

type SelectedItemsState = {
  selected: Record<string, Item>;
  selectItem: (item: Item) => void;
  unselectItem: (id: string) => void;
  unselectAll: () => void;
};

export const useSelectedItemsStore = create<SelectedItemsState>()(
  persist(
    (set) => ({
      selected: {},
      selectItem: (item: Item) =>
        set((state) => ({
          selected: { ...state.selected, [item.id]: item },
        })),
      unselectItem: (id: string) =>
        set((state) => {
          const newSel = Object.fromEntries(
            Object.entries(state.selected).filter(([key]) => key !== id)
          );
          return { selected: newSel };
        }),
      unselectAll: () => set({ selected: {} }),
    }),
    {
      name: 'selected-items',
    }
  )
);
