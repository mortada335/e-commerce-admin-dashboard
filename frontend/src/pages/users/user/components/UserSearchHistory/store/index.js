import { create } from "zustand"

export const useUserSearchHistoryStore = create(() => ({
  sortType: null,
  sortBy: null,
}))

export const setSortType = (value) =>
  useUserSearchHistoryStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useUserSearchHistoryStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useUserSearchHistoryStore.setState({ sortBy: null, sortType: null })
