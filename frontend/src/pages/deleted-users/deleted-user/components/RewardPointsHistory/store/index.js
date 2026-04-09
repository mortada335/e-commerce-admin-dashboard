import { create } from "zustand";

export const useRewardHistoryPoints = create(() => ({
  sortType: null,
  sortBy: null,
}));

const store = useRewardHistoryPoints;

export const setSortType = (value) => store.setState({ sortType: value });
export const setSortBy = (value) => store.setState({ sortBy: value });
export const clearSortValue = () =>
  store.setState({ sortBy: null, sortType: null });
