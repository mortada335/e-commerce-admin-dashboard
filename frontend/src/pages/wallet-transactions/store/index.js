import { create } from "zustand"

export const useWalletTransactionsStore = create(() => ({
  sortType: null,
  sortBy: null,
  isWalletTransactionDialogOpen: false,
  isDeleteWalletTransactionDialogOpen: false,
  selectedWalletTransaction: null,
  isFilterMenu: false,
  searchBy: "quantity",
}))

export const setSearchBy = (value) =>
  useWalletTransactionsStore.setState({ searchBy: value })

export const setIsFilterMenu = (value) =>
  useWalletTransactionsStore.setState({ isFilterMenu: value })
export const setSortType = (value) =>
  useWalletTransactionsStore.setState({ sortType: value })
export const setSortBy = (value) => useWalletTransactionsStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useWalletTransactionsStore.setState({ sortBy: null, sortType: null })
export const setIsWalletTransactionDialogOpen = (value) =>
  useWalletTransactionsStore.setState({ isWalletTransactionDialogOpen: value })
export const setIsDeleteWalletTransactionDialogOpen = (value) =>
  useWalletTransactionsStore.setState({ isDeleteWalletTransactionDialogOpen: value })
export const setSelectedWalletTransaction = (value) =>
  useWalletTransactionsStore.setState({ selectedWalletTransaction: value })
