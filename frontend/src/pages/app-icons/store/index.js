import { create } from "zustand"

export const useAppIconStore = create(() => ({
  isAppIconDialogOpen: false,
  isDeleteAppIconDialogOpen: false,
  isChangeStatusAppIconDialogOpen: false,
  selectedAppIcon: null,
  sortType: null,
  sortBy: null,
  enabled: null,
  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "name",
}))

export const setIsAppIconDialogOpen = (value) =>
  useAppIconStore.setState({ isAppIconDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useAppIconStore.setState({ isDeleteAppIconDialogOpen: value })
export const setSelectedAppIcon = (value) =>
  useAppIconStore.setState({ selectedAppIcon: value })
export const setIsChangeStatusAppIconDialogOpen = (value) =>
  useAppIconStore.setState({ isChangeStatusAppIconDialogOpen: value })
export const setSortType = (value) =>
  useAppIconStore.setState({ sortType: value })
export const setSortBy = (value) => useAppIconStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useAppIconStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) => useAppIconStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useAppIconStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useAppIconStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useAppIconStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useAppIconStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useAppIconStore.setState({ isFilterMenu: value })
export const setEnabled = (value) => useAppIconStore.setState({ enabled: value })
export const ClearFilters = () =>
  useAppIconStore.setState({
    enabled: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "title",
  })
