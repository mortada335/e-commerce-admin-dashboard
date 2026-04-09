import { create } from "zustand"

export const useCustomerMembershipStore = create(() => ({
  sortType: null,
  sortBy: null,
  searchBy: "coupon_code",
  isFilterMenu: false,
}))

export const setSortType = (value) =>
  useCustomerMembershipStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useCustomerMembershipStore.setState({ sortBy: value })

export const setIsFilterMenu = (value) =>
  useCustomerMembershipStore.setState({ isFilterMenu: value })
export const setSearchBy = (value) =>
  useCustomerMembershipStore.setState({ searchBy: value })

export const clearSortValue = () =>
  useCustomerMembershipStore.setState({ sortBy: null, sortType: null })
