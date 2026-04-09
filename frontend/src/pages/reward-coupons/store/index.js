import { create } from "zustand"

export const useRewardCouponStore = create(() => ({
  isGeneralCouponDialogOpen: false,
  isDeleteGeneralCouponDialogOpen: false,
  selectedGeneralCoupon: null,
  sortType: null,
  sortBy: null,
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

export const setIsGeneralCouponDialogOpen = (value) =>
  useRewardCouponStore.setState({ isGeneralCouponDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useRewardCouponStore.setState({ isDeleteGeneralCouponDialogOpen: value })
export const setSelectedGeneralCoupon = (value) =>
  useRewardCouponStore.setState({ selectedGeneralCoupon: value })

export const setSortType = (value) =>
  useRewardCouponStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useRewardCouponStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useRewardCouponStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) =>
  useRewardCouponStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useRewardCouponStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useRewardCouponStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useRewardCouponStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useRewardCouponStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useRewardCouponStore.setState({ isFilterMenu: value })
export const setStatus = (value) =>
  useRewardCouponStore.setState({ status: value })
export const setDateAdded = (value) =>
  useRewardCouponStore.setState({ dateAdded: value })
export const setDateStart = (value) =>
  useRewardCouponStore.setState({ dateStart: value })
export const setDateEnd = (value) =>
  useRewardCouponStore.setState({ dateEnd: value })

export const ClearFilters = () =>
  useRewardCouponStore.setState({
    dateAdded: null,
    dateStart: null,
    dateEnd: null,
    status: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "code",
  })
