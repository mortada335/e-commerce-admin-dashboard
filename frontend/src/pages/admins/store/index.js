import { create } from "zustand";

export const useUserStore = create(() => ({
  isUserDialogOpen: false,
  isDeleteUserDialogOpen: false,
  isAssignRoleToUserDialogOpen:false,
  isWarhouseDialogOpen: false,
  selectedUser: null,
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
  searchBy: "username",
}));

export const setIsUserDialogOpen = (value) =>
  useUserStore.setState({ isUserDialogOpen: value });
export const setIsDeleteUserDialogOpen = (value) =>
  useUserStore.setState({ isDeleteUserDialogOpen: value });
export const setSelectedUser = (value) =>
  useUserStore.setState({ selectedUser: value });
export const setActiveCustomerMembershipId = (value) =>
  useUserStore.setState({ activeCustomerMembershipId: value });
export const setIsChangeStatusDialogOpen = (value) =>
  useUserStore.setState({ isChangeStatusDialogOpen: value });
export const setIsChangePasswordDialogOpen = (value) =>
  useUserStore.setState({ isChangePasswordDialogOpen: value });
export const setSortType = (value) =>
  useUserStore.setState({ sortType: value });
export const setSortBy = (value) => useUserStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useUserStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useUserStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useUserStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useUserStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useUserStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useUserStore.setState({ searchBy: value });

export const setDateJoined = (value) =>
  useUserStore.setState({ dateJoined: value });

export const setStatus = (value) => useUserStore.setState({ status: value });
export const setIsFilterMenu = (value) =>
  useUserStore.setState({ isFilterMenu: value });
export const setIsSuperuser = (value) =>
  useUserStore.setState({ isSuperuser: value });

export const setIsLTVFilter = (value) =>
  useUserStore.setState({ isLTVFilter: value });
export const setLtvMaxThreshold = (value) =>
  useUserStore.setState({ ltvMaxThreshold: value });
export const setLtvMinThreshold = (value) =>
  useUserStore.setState({ ltvMinThreshold: value });
export const setDebouncedLtvMaxThreshold = (value) =>
  useUserStore.setState({ debouncedLtvMaxThreshold: value });
export const setDebouncedLtvMinThreshold = (value) =>
  useUserStore.setState({ debouncedLtvMinThreshold: value });
export const setLtvStartDate = (value) =>
  useUserStore.setState({ ltvStartDate: value });
export const setLtvEndDate = (value) =>
  useUserStore.setState({ ltvEndDate: value });
export const setRangeDate = (value) =>
  useUserStore.setState({ rangeDate: value });
export const setIsWarhouseDialogOpen = (value) =>
  useUserStore.setState({ isWarhouseDialogOpen: value });
export const setIsAssignRoleToUserDialogOpen = (value)=>
  useUserStore.setState({ isAssignRoleToUserDialogOpen : value})