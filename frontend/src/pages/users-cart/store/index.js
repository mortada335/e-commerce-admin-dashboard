import { create } from "zustand"

export const UsersCartStore = create(() => ({
  sortType: null,
  sortBy: null,
  isCartDialogOpen: false,
  isDeleteCartDialogOpen: false,
  selectedCart: null,
  isFilterMenu: false,
  searchBy: "quantity",
}))

export const setSearchBy = (value) =>
  UsersCartStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  UsersCartStore.setState({ isFilterMenu: value })
export const setSortType = (value) =>
  UsersCartStore.setState({ sortType: value })
export const setSortBy = (value) => UsersCartStore.setState({ sortBy: value })
export const clearSortValue = () =>
  UsersCartStore.setState({ sortBy: null, sortType: null })
export const setIsCartDialogOpen = (value) =>
  UsersCartStore.setState({ isCartDialogOpen: value })
export const setIsDeleteCartDialogOpen = (value) =>
  UsersCartStore.setState({ isDeleteCartDialogOpen: value })
export const setSelectedCart = (value) =>
  UsersCartStore.setState({ selectedCart: value })
