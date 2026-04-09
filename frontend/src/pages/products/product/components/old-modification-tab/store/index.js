import { create } from "zustand";

export const useModificationStore = create(() => ({
  isOptionDialogOpen: false,
  isUpdateOptionProductDialogOpen: false,
  isUpdateOptionStatusDialogOpen: false,
  isDeleteOptionDialogOpen: false,

  selectedOption: null,
  orderDetails: {},
  productsOrder: [],
  sortType: null,
  sortBy: null,
  dateAdded: null,
  dateModified: null,
  search: "",
  status: null,
  paymentType: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  selectedCity: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "product_option_value_id",
  rangeDate: null,
}));

export const setIsOptionDialogOpen = (value) =>
  useModificationStore.setState({ isOptionDialogOpen: value });
export const setIsUpdateOptionProductDialogOpen = (value) =>
  useModificationStore.setState({ isUpdateOptionProductDialogOpen: value });
export const setIsUpdateOptionStatusDialogOpen = (value) =>
  useModificationStore.setState({ isUpdateOptionStatusDialogOpen: value });
export const setIsDeleteOptionDialogOpen = (value) =>
  useModificationStore.setState({ isDeleteOptionDialogOpen: value });

export const setSelectedOption = (value) =>
  useModificationStore.setState({ selectedOption: value });
export const setSelectedCity = (value) =>
  useModificationStore.setState({ selectedCity: value });
export const setOrderDetails = (value) =>
  useModificationStore.setState({ orderDetails: value });
export const setProductsOrder = (value) =>
  useModificationStore.setState({ productsOrder: value });

export const setSortType = (value) =>
  useModificationStore.setState({ sortType: value });
export const setSortBy = (value) => useModificationStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useModificationStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useModificationStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useModificationStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useModificationStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useModificationStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useModificationStore.setState({ searchBy: value });

export const setDateAdded = (value) =>
  useModificationStore.setState({ dateAdded: value });
export const setDateModified = (value) =>
  useModificationStore.setState({ dateModified: value });
export const setStatus = (value) => useModificationStore.setState({ status: value });
export const setPaymentType = (value) =>
  useModificationStore.setState({ paymentType: value });

export const setIsFilterMenu = (value) =>
  useModificationStore.setState({ isFilterMenu: value });
export const setRangeDate = (value) =>
  useModificationStore.setState({ rangeDate: value });
export const ClearFilters = () =>
  useModificationStore.setState({
    rangeDate: null,
    paymentType: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    selectedCity: null,
    searchBy: "customer_phone_number",
  });


