import { create } from "zustand"

export const useGiftCardsStore = create(() => ({

    isGiftCardDialogOpen: false,
    isBulkGiftCardDialogOpen: false,
    isDeleteGiftCardDialogOpen: false,
    selectedGiftCard: null,
    sortType: null,
    sortBy: null,
    isFilterMenu: false,

}))

export const setSortType = (value) =>
  useGiftCardsStore.setState({ sortType: value })
export const setSortBy = (value) => useGiftCardsStore.setState({ sortBy: value })
export const setIsFilterMenu = (value) =>
  useGiftCardsStore.setState({ isFilterMenu: value })
export const setIsGiftCardDialogOpen = (value) =>
  useGiftCardsStore.setState({ isGiftCardDialogOpen: value })
export const setIsBulkGiftCardDialogOpen = (value) =>
  useGiftCardsStore.setState({ isBulkGiftCardDialogOpen: value })
export const setIsDeleteGiftCardDialogOpen = (value) =>
  useGiftCardsStore.setState({ isDeleteGiftCardDialogOpen: value })
export const setSelectedGiftCard = (value) =>
  useGiftCardsStore.setState({ selectedGiftCard: value })
export const clearSortValue = () =>
  useGiftCardsStore.setState({ sortBy: null, sortType: null })