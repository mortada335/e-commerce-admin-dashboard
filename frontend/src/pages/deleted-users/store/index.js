import { create } from "zustand";

export const useDeletedUsersStore = create(() => ({
  activeCustomerMembershipId: "",
  isChangePasswordDialogOpen: false,
  sortType: null,
  sortBy: null,
  isChangeStatusDialogOpen: false,
  dateJoined: null,
  search: null,
  status: null,
  isFilterMenu: false,
  isSuperuser: false,
  isLTVFilter: false,
  debouncedSearchValue: null,
  ltvMaxThreshold: null,
  debouncedLtvMaxThreshold: null,
  ltvMinThreshold: null,
  debouncedLtvMinThreshold: null,
  ltvStartDate: null,
  ltvEndDate: null,
  rangeDate: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "phone_number",
  applyLTVFilter: false,
}));

export const setActiveCustomerMembershipId = (value) =>
  useDeletedUsersStore.setState({ activeCustomerMembershipId: value });
export const setIsChangeStatusDialogOpen = (value) =>
  useDeletedUsersStore.setState({ isChangeStatusDialogOpen: value });
export const setIsChangePasswordDialogOpen = (value) =>
  useDeletedUsersStore.setState({ isChangePasswordDialogOpen: value });

export const setSortType = (value) =>
  useDeletedUsersStore.setState({ sortType: value });

export const setSortBy = (value) =>
  useDeletedUsersStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useDeletedUsersStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) =>
  useDeletedUsersStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useDeletedUsersStore.setState({ debouncedSearchValue: value });
export const setPage = (value) =>
  useDeletedUsersStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useDeletedUsersStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useDeletedUsersStore.setState({ searchBy: value });

export const setDateJoined = (value) =>
  useDeletedUsersStore.setState({ dateJoined: value });

export const setStatus = (value) =>
  useDeletedUsersStore.setState({ status: value });
export const setIsFilterMenu = (value) =>
  useDeletedUsersStore.setState({ isFilterMenu: value });
export const setIsSuperuser = (value) =>
  useDeletedUsersStore.setState({ isSuperuser: value });

export const setIsLTVFilter = (value) =>
  useDeletedUsersStore.setState({ isLTVFilter: value });
export const setApplyLTVFilter = (value) =>
  useDeletedUsersStore.setState({ applyLTVFilter: value });
export const setLtvMaxThreshold = (value) =>
  useDeletedUsersStore.setState({ ltvMaxThreshold: value });
export const setLtvMinThreshold = (value) =>
  useDeletedUsersStore.setState({ ltvMinThreshold: value });
export const setDebouncedLtvMaxThreshold = (value) =>
  useDeletedUsersStore.setState({ debouncedLtvMaxThreshold: value });
export const setDebouncedLtvMinThreshold = (value) =>
  useDeletedUsersStore.setState({ debouncedLtvMinThreshold: value });
export const setLtvStartDate = (value) =>
  useDeletedUsersStore.setState({ ltvStartDate: value });
export const setLtvEndDate = (value) =>
  useDeletedUsersStore.setState({ ltvEndDate: value });
export const setRangeDate = (value) =>
  useDeletedUsersStore.setState({ rangeDate: value });
export const ClearFilters = () =>
  useDeletedUsersStore.setState({
    search: "",
    status: null,
    isLTVFilter: false,
    debouncedSearchValue: null,
    ltvMaxThreshold: null,
    debouncedLtvMaxThreshold: null,
    ltvMinThreshold: null,
    debouncedLtvMinThreshold: null,
    ltvStartDate: null,
    ltvEndDate: null,
    rangeDate: null,
    searchBy: "username",
    applyLTVFilter: false,
  });
