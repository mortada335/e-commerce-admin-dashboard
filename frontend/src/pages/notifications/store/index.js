import { create } from "zustand"

export const useNotificationStore = create(() => ({
  isScheduledNotificationDialogOpen: false,
  isDeleteNotificationDialogOpen: false,
  isChangeStatusDialogOpen: false,
  selectedNotification: null,
  sortType: null,
  sortBy: null,
  isFilterMenu: false,
  page: 1,
  itemPerPage: "25",
  searchBy: "code",
}))

export const setIsChangeStatusDialogOpen = (value) =>
  useNotificationStore.setState({ isChangeStatusDialogOpen: value })
export const setIsScheduledNotificationDialogOpen = (value) =>
  useNotificationStore.setState({ isScheduledNotificationDialogOpen: value })
export const setIsDeleteNotificationDialogOpen = (value) =>
  useNotificationStore.setState({ isDeleteNotificationDialogOpen: value })
export const setSelectedNotification = (value) =>
  useNotificationStore.setState({ selectedNotification: value })

export const setSortType = (value) =>
  useNotificationStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useNotificationStore.setState({ sortBy: value })

export const setPage = (value) =>
  useNotificationStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useNotificationStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useNotificationStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useNotificationStore.setState({ isFilterMenu: value })
export const setStatus = (value) =>
  useNotificationStore.setState({ status: value })
export const setDateAdded = (value) =>
  useNotificationStore.setState({ dateAdded: value })
export const setDateStart = (value) =>
  useNotificationStore.setState({ dateStart: value })
export const setDateEnd = (value) =>
  useNotificationStore.setState({ dateEnd: value })

export const ClearFilters = () =>
  useNotificationStore.setState({
    dateAdded: null,
    dateStart: null,
    dateEnd: null,
    status: null,
    debouncedSearchValue: null,

    search: "",
    searchBy: "code",
  })
