import { create } from "zustand"

export const useCategoryStore = create(() => ({
  isCategoryDialogOpen: false,
  isDeleteCategoryDialogOpen: false,
  isChangeStatusCategoryDialogOpen: false,
  selectedCategory: null,
  sortType: null,
  sortBy: null,
  search: null,
  debouncedSearchValue: null,
  isFilterMenu: false,
  page: 1,
  itemPerPage: "25",
  onlyMainCategories: true,
  mainCategories: [],
  searchBy: "name",
}))

export const setIsCategoryDialogOpen = (value) =>
  useCategoryStore.setState({ isCategoryDialogOpen: value })
export const setIsDeleteCategoryDialogOpen = (value) =>
  useCategoryStore.setState({ isDeleteCategoryDialogOpen: value })
export const setIsChangeStatusCategoryDialogOpen = (value) =>
  useCategoryStore.setState({ isChangeStatusCategoryDialogOpen: value })
export const setSelectedCategory = (value) =>
  useCategoryStore.setState({ selectedCategory: value })
export const setSortType = (value) =>
  useCategoryStore.setState({ sortType: value })
export const setSortBy = (value) => useCategoryStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useCategoryStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) => useCategoryStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useCategoryStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useCategoryStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useCategoryStore.setState({ itemPerPage: value })
export const setOnlyMainCategories = (value) =>
  useCategoryStore.setState({ onlyMainCategories: value })
export const setMainCategories = (value) =>
  useCategoryStore.setState({ mainCategories: value })
export const setIsFilterMenu = (value) =>
  useCategoryStore.setState({ isFilterMenu: value })
export const setSearchBy = (value) =>
  useCategoryStore.setState({ searchBy: value })

export const ClearFilters = () =>
  useCategoryStore.setState({
    onlyMainCategories: true,

    debouncedSearchValue: null,
    isFilterMenu: null,

    search: "",
    searchBy: "",
  })
