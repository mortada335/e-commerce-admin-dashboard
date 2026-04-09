import { create } from "zustand"

export const useGeneralCouponStore = create(() => ({
  isGeneralCouponDialogOpen: false,
  isDeleteGeneralCouponDialogOpen: false,
  isChangeStatusDialogOpen: false,
  selectedGeneralCoupon: null,
  sortType: null,
  sortBy: null,
  historySortType: null,
  historySortBy: null,
  dateAdded: null,
  dateStart: null,
  dateEnd: null,
  status: null,
  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "code",
}))

export const setIsChangeStatusDialogOpen = (value) =>
  useGeneralCouponStore.setState({ isChangeStatusDialogOpen: value })
export const setIsGeneralCouponDialogOpen = (value) =>
  useGeneralCouponStore.setState({ isGeneralCouponDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useGeneralCouponStore.setState({ isDeleteGeneralCouponDialogOpen: value })
export const setSelectedGeneralCoupon = (value) =>
  useGeneralCouponStore.setState({ selectedGeneralCoupon: value })

export const setSortType = (value) =>
  useGeneralCouponStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useGeneralCouponStore.setState({ sortBy: value })
export const setHistorySortType = (value) =>
  useGeneralCouponStore.setState({ historySortType: value })
export const setHistorySortBy = (value) =>
  useGeneralCouponStore.setState({ historySortBy: value })
export const clearSortValue = () =>
  useGeneralCouponStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) =>
  useGeneralCouponStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useGeneralCouponStore.setState({ debouncedSearchValue: value })
export const setPage = (value) =>
  useGeneralCouponStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useGeneralCouponStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useGeneralCouponStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useGeneralCouponStore.setState({ isFilterMenu: value })
export const setStatus = (value) =>
  useGeneralCouponStore.setState({ status: value })
export const setDateAdded = (value) =>
  useGeneralCouponStore.setState({ dateAdded: value })
export const setDateStart = (value) =>
  useGeneralCouponStore.setState({ dateStart: value })
export const setDateEnd = (value) =>
  useGeneralCouponStore.setState({ dateEnd: value })

export const ClearFilters = () =>
  useGeneralCouponStore.setState({
    dateAdded: null,
    dateStart: null,
    dateEnd: null,
    status: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "code",
  })
