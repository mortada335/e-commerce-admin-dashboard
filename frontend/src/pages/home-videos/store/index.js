import { create } from "zustand"

export const useHomeVideoStore = create(() => ({
  isHomeVideoDialogOpen: false,
  isDeleteHomeVideoDialogOpen: false,
  selectedHomeVideo: null,
  sortType: null,
  sortBy: null,
  eventDate: null,
  HomeVideoType: null,
  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "title",
}))

export const setIsHomeVideoDialogOpen = (value) =>
  useHomeVideoStore.setState({ isHomeVideoDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useHomeVideoStore.setState({ isDeleteHomeVideoDialogOpen: value })
export const setSelectedHomeVideo = (value) =>
  useHomeVideoStore.setState({ selectedHomeVideo: value })

export const setSortType = (value) =>
  useHomeVideoStore.setState({ sortType: value })
export const setSortBy = (value) => useHomeVideoStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useHomeVideoStore.setState({ sortBy: null, sortType: null })

export const setSearch = (value) => useHomeVideoStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useHomeVideoStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useHomeVideoStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useHomeVideoStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useHomeVideoStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useHomeVideoStore.setState({ isFilterMenu: value })
export const setHomeVideoType = (value) =>
  useHomeVideoStore.setState({ HomeVideoType: value })
export const setEventDate = (value) =>
  useHomeVideoStore.setState({ eventDate: value })

export const ClearFilters = () =>
  useHomeVideoStore.setState({
    eventDate: null,
    HomeVideoType: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "title",
  })
