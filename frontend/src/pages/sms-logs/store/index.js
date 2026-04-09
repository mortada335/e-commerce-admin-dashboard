import { create } from "zustand"

export const useSMSLogsStore = create(() => ({
  isSMSLogDialogOpen: false,
  isDeleteSMSLogDialogOpen: false,
  selectedSMSLog: null,
  sortType: null,
  sortBy: null,
  eventDate: null,
  SMSLogType: null,
  search: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "level",
}))

export const setIsSMSLogDialogOpen = (value) =>
  useSMSLogsStore.setState({ isSMSLogDialogOpen: value })
export const setIsDeleteDialogOpen = (value) =>
  useSMSLogsStore.setState({ isDeleteSMSLogDialogOpen: value })
export const setSelectedSMSLog = (value) =>
  useSMSLogsStore.setState({ selectedSMSLog: value })

export const setSortType = (value) =>
  useSMSLogsStore.setState({ sortType: value })
export const setSortBy = (value) => useSMSLogsStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useSMSLogsStore.setState({ sortBy: null, sortType: null })

export const setSearch = (value) => useSMSLogsStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useSMSLogsStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useSMSLogsStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useSMSLogsStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useSMSLogsStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useSMSLogsStore.setState({ isFilterMenu: value })
export const setSMSLogType = (value) =>
  useSMSLogsStore.setState({ SMSLogType: value })
export const setEventDate = (value) =>
  useSMSLogsStore.setState({ eventDate: value })

export const ClearFilters = () =>
  useSMSLogsStore.setState({
    eventDate: null,
    SMSLogType: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "level",
  })
