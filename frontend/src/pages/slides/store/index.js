import { create } from "zustand"

export const useBannerStore = create(() => ({
  isBannerDialogOpen: false,
  isDeleteBannerDialogOpen: false,
  selectedBanner: null,
  sortType: null,
  sortBy: null,
  eventDate: null,
  bannerType: null,
  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "title",
}))

export const setIsBannerDialogOpen = (value) =>
  useBannerStore.setState({ isBannerDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useBannerStore.setState({ isDeleteBannerDialogOpen: value })
export const setSelectedBanner = (value) =>
  useBannerStore.setState({ selectedBanner: value })

export const setSortType = (value) =>
  useBannerStore.setState({ sortType: value })
export const setSortBy = (value) => useBannerStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useBannerStore.setState({ sortBy: null, sortType: null })

export const setSearch = (value) => useBannerStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useBannerStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useBannerStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useBannerStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useBannerStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useBannerStore.setState({ isFilterMenu: value })
export const setBannerType = (value) =>
  useBannerStore.setState({ bannerType: value })
export const setEventDate = (value) =>
  useBannerStore.setState({ eventDate: value })

export const ClearFilters = () =>
  useBannerStore.setState({
    eventDate: null,
    bannerType: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "title",
  })
