import { create } from "zustand";

export const useRolesStore = create(() => ({
  isRoleDialogOpen: false,
  isEditRoleDialogOpen: false,
  isDeleteRoleDialogOpen: false,
  isAssignRoleDialogOpen: false,
  selectedRole: null,
  activeCustomerMembershipId: "",
  isChangePasswordDialogOpen: false,
  sortType: null,
  sortBy: null,
  isChangeStatusDialogOpen: false,
  dateJoined: null,
  search: null,
  status: null,
  isFilterMenu: false,
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
  applyLTVFilter: false,
}));

export const setIsRoleDialogOpen = (value) =>
  useRolesStore.setState({ isRoleDialogOpen: value });

export const setIsEditRoleDialogOpen = (value) =>
  useRolesStore.setState({ isEditRoleDialogOpen: value });

export const setIsDeleteRoleDialogOpen = (value) =>
  useRolesStore.setState({ isDeleteRoleDialogOpen: value });

export const setSelectedRole = (value) =>
  useRolesStore.setState({ selectedRole: value });
export const setActiveCustomerMembershipId = (value) =>
  useRolesStore.setState({ activeCustomerMembershipId: value });
export const setIsChangeStatusDialogOpen = (value) =>
  useRolesStore.setState({ isChangeStatusDialogOpen: value });
export const setIsChangePasswordDialogOpen = (value) =>
  useRolesStore.setState({ isChangePasswordDialogOpen: value });

export const setSortType = (value) =>
  useRolesStore.setState({ sortType: value });

export const setSortBy = (value) => useRolesStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useRolesStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useRolesStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useRolesStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useRolesStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useRolesStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useRolesStore.setState({ searchBy: value });

export const setDateJoined = (value) =>
  useRolesStore.setState({ dateJoined: value });

export const setStatus = (value) => useRolesStore.setState({ status: value });
export const setIsFilterMenu = (value) =>
  useRolesStore.setState({ isFilterMenu: value });

export const ClearFilters = () =>
  useRolesStore.setState({
    search: "",
    status: null,
    rangeDate: null,
    searchBy: "username",
  });

  export const setIsAssignRoleDialogOpen = (value) =>
    useRolesStore.setState({ isAssignRoleDialogOpen : value})