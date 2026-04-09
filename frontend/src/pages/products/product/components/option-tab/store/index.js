import { create } from "zustand";

export const useOptionStore = create(() => ({
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
  useOptionStore.setState({ isOptionDialogOpen: value });
export const setIsUpdateOptionProductDialogOpen = (value) =>
  useOptionStore.setState({ isUpdateOptionProductDialogOpen: value });
export const setIsUpdateOptionStatusDialogOpen = (value) =>
  useOptionStore.setState({ isUpdateOptionStatusDialogOpen: value });
export const setIsDeleteOptionDialogOpen = (value) =>
  useOptionStore.setState({ isDeleteOptionDialogOpen: value });

export const setSelectedOption = (value) =>
  useOptionStore.setState({ selectedOption: value });
export const setSelectedCity = (value) =>
  useOptionStore.setState({ selectedCity: value });
export const setOrderDetails = (value) =>
  useOptionStore.setState({ orderDetails: value });
export const setProductsOrder = (value) =>
  useOptionStore.setState({ productsOrder: value });

export const setSortType = (value) =>
  useOptionStore.setState({ sortType: value });
export const setSortBy = (value) => useOptionStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useOptionStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useOptionStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useOptionStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useOptionStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useOptionStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useOptionStore.setState({ searchBy: value });

export const setDateAdded = (value) =>
  useOptionStore.setState({ dateAdded: value });
export const setDateModified = (value) =>
  useOptionStore.setState({ dateModified: value });
export const setStatus = (value) => useOptionStore.setState({ status: value });
export const setPaymentType = (value) =>
  useOptionStore.setState({ paymentType: value });

export const setIsFilterMenu = (value) =>
  useOptionStore.setState({ isFilterMenu: value });
export const setRangeDate = (value) =>
  useOptionStore.setState({ rangeDate: value });
export const ClearFilters = () =>
  useOptionStore.setState({
    rangeDate: null,
    paymentType: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    selectedCity: null,
    searchBy: "customer_phone_number",
  });


