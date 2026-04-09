import { create } from "zustand"

export const useBrandStore = create(() => ({
  isBrandDialogOpen: false,
  isDeleteBrandDialogOpen: false,
  isChangeStatusBrandDialogOpen: false,
  selectedBrand: null,
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

export const setIsBrandDialogOpen = (value) =>
  useBrandStore.setState({ isBrandDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useBrandStore.setState({ isDeleteBrandDialogOpen: value })
export const setSelectedBrand = (value) =>
  useBrandStore.setState({ selectedBrand: value })
export const setIsChangeStatusBrandDialogOpen = (value) =>
  useBrandStore.setState({ isChangeStatusBrandDialogOpen: value })
export const setSortType = (value) =>
  useBrandStore.setState({ sortType: value })
export const setSortBy = (value) => useBrandStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useBrandStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) => useBrandStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useBrandStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useBrandStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useBrandStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useBrandStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useBrandStore.setState({ isFilterMenu: value })
export const setEnabled = (value) => useBrandStore.setState({ enabled: value })
export const ClearFilters = () =>
  useBrandStore.setState({
    enabled: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "title",
  })
