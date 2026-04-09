import { create } from "zustand"

export const useProductStore = create(() => ({
  isProductsBulkPriceUpdateDialogOpen: false,
  isProductsBulkStatusUpdateDialogOpen: false,
  isProductsBulkAssignCategoriesDialogOpen: false,
  isApplyRandomDiscountDialogOpen: false,
  isProductDialogOpen: false,
  isDeleteProductDialogOpen: false,
  selectedProduct: null,
  selectedProducts: [],
  isDuplicateProductDialog: false,
  isAddImageDialog: false,
  isAttributesDialog: false,
  isDeleteAttributeDialogOpen: false,
  deleteAttribute: null,
  isDeleteVideoDialogOpen: false,
  isDeleteImageDialogOpen: false,
  isEditImageDialogOpen: false,
  currentSelectedImage: null,
  isEditVideoDialogOpen: false,
  currentSelectedVideo: null,
  selectedImageId: "",
  selectedVideoId: "",
  sortType: null,
  sortBy: null,
  dateAdded: null,
  dateModified: null,
  discountStartDate: null,
  discountExpiryDate: null,
  search: null,
  status: null,
  productModel: { filter_name: "", filter_id: "" },
  isFilterMenu: false,
  isChangeStatus: false,
  debouncedSearchValue: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "available_quantity",
  rangeDate: null,
  
  // Trigger clear filter button.
  clearFilterBtn: false,
}))

export const setIsProductDialogOpen = (value) =>
  useProductStore.setState({ isProductDialogOpen: value })
export const setDeleteAttribute = (value) =>
  useProductStore.setState({ deleteAttribute: value })
export const setIsProductsBulkAssignCategoriesDialogOpen = (value) =>
  useProductStore.setState({ isProductsBulkAssignCategoriesDialogOpen: value })
export const setIsProductsBulkStatusUpdateDialogOpen = (value) =>
  useProductStore.setState({ isProductsBulkStatusUpdateDialogOpen: value })
export const setIsProductsBulkPriceUpdateDialogOpen = (value) =>
  useProductStore.setState({ isProductsBulkPriceUpdateDialogOpen: value })
export const setIsApplyRandomDiscountDialogOpen = (value) =>
  useProductStore.setState({ isApplyRandomDiscountDialogOpen: value })
export const setIsDeleteProductDialogOpen = (value) =>
  useProductStore.setState({ isDeleteProductDialogOpen: value })
export const setSelectedProduct = (value) =>
  useProductStore.setState({ selectedProduct: value })
export const setSelectedProducts = (value) => {
  const { selectedProducts } = useProductStore.getState()
  const findProductIndex = selectedProducts.findIndex(
    (item) => item.id === value.id
  )

  if (findProductIndex !== -1) {
    // If the product already exists in the array, remove it
    const updatedProducts = selectedProducts.filter(
      (item) => item.id !== value.id
    )
    useProductStore.setState({ selectedProducts: updatedProducts })
  } else {
    // If the product doesn't exist in the array, add it
    useProductStore.setState((state) => ({
      selectedProducts: [...state.selectedProducts, value],
    }))
  }
}
export const clearSelectedProducts = () => {
  useProductStore.setState({ selectedProducts: [] })
}
export const setIsDuplicateProductDialog = (value) =>
  useProductStore.setState({ isDuplicateProductDialog: value })
export const setIsAddImageDialog = (value) =>
  useProductStore.setState({ isAddImageDialog: value })
export const setIsAttributesDialog = (value) =>
  useProductStore.setState({ isAttributesDialog: value })
export const setIsDeleteAttributeDialogOpen = (value) =>
  useProductStore.setState({ isDeleteAttributeDialogOpen: value })
export const setIsChangeStatusDialogOpen = (value) =>
  useProductStore.setState({ isChangeStatus: value })
export const setIsDeleteImageDialogOpen = (value) =>
  useProductStore.setState({ isDeleteImageDialogOpen: value })
export const setIsDeleteVideoDialogOpen = (value) =>
  useProductStore.setState({ isDeleteVideoDialogOpen: value })
export const setIsEditImageDialogOpen = (value) =>
  useProductStore.setState({ isEditImageDialogOpen: value })
export const setIsEditVideoDialogOpen = (value) =>
  useProductStore.setState({ isEditVideoDialogOpen: value })
export const isProductSelected = (productId) => {
  const { selectedProducts } = useProductStore.getState()
  return selectedProducts.some((product) => product.id === productId)
}
export const setSortType = (value) =>
  useProductStore.setState({ sortType: value })
export const setSortBy = (value) => useProductStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useProductStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) => useProductStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useProductStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useProductStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useProductStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useProductStore.setState({ searchBy: value })
export const setProductModel = (value) =>
  useProductStore.setState({ productModel: value })

export const setDateAdded = (value) =>
  useProductStore.setState({ dateAdded: value })
export const setDateModified = (value) =>
  useProductStore.setState({ dateModified: value })
export const setDiscountStartDate = (value) =>
  useProductStore.setState({ discountStartDate: value })

export const setDiscountExpiryDate = (value) =>
  useProductStore.setState({ discountExpiryDate: value })

export const setStatus = (value) => useProductStore.setState({ status: value })

export const setIsFilterMenu = (value) =>
  useProductStore.setState({ isFilterMenu: value })
export const setSelectedImageId = (value) =>
  useProductStore.setState({ selectedImageId: value })
export const setSelectedVideoId = (value) =>
  useProductStore.setState({ selectedVideoId: value })
export const setCurrentSelectedImage = (value) =>
  useProductStore.setState({ currentSelectedImage: value })
export const setCurrentSelectedVideo = (value) =>
  useProductStore.setState({ currentSelectedVideo: value })
export const setRangeDate = (value) =>
  useProductStore.setState({ rangeDate: value })
export const ClearFilters = () =>
  useProductStore.setState({
    rangeDate: null,
    discountStartDate: null,
    discountExpiryDate: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    searchBy: "available_quantity",
  })

//Mutate clearFilter state
export const setClearFilterBtn = (value) => {
  useProductStore.setState({ clearFilterBtn: value })
}
