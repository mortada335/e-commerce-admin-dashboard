import { create } from "zustand"

export const UserRecentProductsStore = create(() => ({
  sortType: null,
  sortBy: null,
}))

export const setSortType = (value) =>
  UserRecentProductsStore.setState({ sortType: value })
export const setSortBy = (value) =>
  UserRecentProductsStore.setState({ sortBy: value })
export const clearSortValue = () =>
  UserRecentProductsStore.setState({ sortBy: null, sortType: null })
