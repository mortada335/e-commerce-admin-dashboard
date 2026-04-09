import { create } from "zustand"

export const useAttributesGroupStore = create(() => ({
  isAttributesGroupDialogOpen: false,
  isDeleteAttributesGroupDialogOpen: false,
  selectedAttributesGroup: null,
  sortType: null,
  sortBy: null,
}))

export const setIsAttributesGroupDialogOpen = (value) =>
  useAttributesGroupStore.setState({ isAttributesGroupDialogOpen: value })
export const setIsDeleteAttributesGroupDialogOpen = (value) =>
  useAttributesGroupStore.setState({ isDeleteAttributesGroupDialogOpen: value })
export const setSelectedAttributesGroup = (value) =>
  useAttributesGroupStore.setState({ selectedAttributesGroup: value })

export const setSortType = (value) =>
  useAttributesGroupStore.setState({ sortType: value })
export const setSortBy = (value) =>
  useAttributesGroupStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useAttributesGroupStore.setState({ sortBy: null, sortType: null })
