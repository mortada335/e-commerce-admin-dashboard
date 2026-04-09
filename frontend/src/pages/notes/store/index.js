import { create } from "zustand"

export const useNoteStore = create(() => ({
  isNoteDialogOpen: false,
  isDeleteNoteDialogOpen: false,
  selectedNote: null,
  sortType: null,
  sortBy: null,
}))

export const setIsNoteDialogOpen = (value) =>
  useNoteStore.setState({ isNoteDialogOpen: value })
export const setIsDeleteNoteDialogOpen = (value) =>
  useNoteStore.setState({ isDeleteNoteDialogOpen: value })
export const setSelectedNote = (value) =>
  useNoteStore.setState({ selectedNote: value })

export const setSortType = (value) => useNoteStore.setState({ sortType: value })
export const setSortBy = (value) => useNoteStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useNoteStore.setState({ sortBy: null, sortType: null })
