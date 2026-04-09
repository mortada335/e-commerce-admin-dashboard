import { create } from "zustand"

export const useAttributeStore = create(() => ({
  isAttributeDialogOpen: false,
  isDeleteAttributeDialogOpen: false,
  selectedAttribute: null,
  sortType: null,
  sortBy: null,
}))

export const setIsAttributeDialogOpen = (value) =>
  useAttributeStore.setState({ isAttributeDialogOpen: value })
export const setIsDeleteAttributeDialogOpen = (value) =>
  useAttributeStore.setState({ isDeleteAttributeDialogOpen: value })
export const setSelectedAttribute = (value) =>
  useAttributeStore.setState({ selectedAttribute: value })

export const setSortType = (value) =>
  useAttributeStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useAttributeStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useAttributeStore.setState({ sortBy: null, sortType: null })
