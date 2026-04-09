import { create } from "zustand"

export const usePointsCouponStore = create(() => ({
  isPointsCouponDialogOpen: false,
  isDeletePointsCouponDialogOpen: false,
  selectedPointsCoupon: null,
  sortType: null,
  sortBy: null,
  createdDate: null,

  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "name",
}))

export const setIsPointsCouponDialogOpen = (value) =>
  usePointsCouponStore.setState({ isPointsCouponDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  usePointsCouponStore.setState({ isDeletePointsCouponDialogOpen: value })
export const setSelectedPointsCoupon = (value) =>
  usePointsCouponStore.setState({ selectedPointsCoupon: value })

export const setSortType = (value) =>
  usePointsCouponStore.setState({ sortType: value })
export const setSortBy = (value) =>
  usePointsCouponStore.setState({ sortBy: value })
export const clearSortValue = () =>
  usePointsCouponStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) =>
  usePointsCouponStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  usePointsCouponStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => usePointsCouponStore.setState({ page: value })
export const setItemPerPage = (value) =>
  usePointsCouponStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  usePointsCouponStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  usePointsCouponStore.setState({ isFilterMenu: value })

export const setCreatedDate = (value) =>
  usePointsCouponStore.setState({ createdDate: value })

export const ClearFilters = () =>
  usePointsCouponStore.setState({
    createdDate: null,

    debouncedSearchValue: null,

    search: "",
    searchBy: "name",
  })
