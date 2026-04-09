import { create } from "zustand";

export const useOrderStore = create(() => ({
  isOrderDialogOpen: false,
  isUpdateOrderProductDialogOpen: false,
  isUpdateOrderStatusDialogOpen: false,
  isDeleteOrderDialogOpen: false,

  selectedOrder: null,
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
  searchBy: "order_id",
  rangeDate: null,
}));

export const setIsOrderDialogOpen = (value) =>
  useOrderStore.setState({ isOrderDialogOpen: value });
export const setIsUpdateOrderProductDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderProductDialogOpen: value });
export const setIsUpdateOrderStatusDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderStatusDialogOpen: value });
export const setIsDeleteOrderDialogOpen = (value) =>
  useOrderStore.setState({ isDeleteOrderDialogOpen: value });

export const setSelectedOrder = (value) =>
  useOrderStore.setState({ selectedOrder: value });
export const setSelectedCity = (value) =>
  useOrderStore.setState({ selectedCity: value });
export const setOrderDetails = (value) =>
  useOrderStore.setState({ orderDetails: value });
export const setProductsOrder = (value) =>
  useOrderStore.setState({ productsOrder: value });

export const setSortType = (value) =>
  useOrderStore.setState({ sortType: value });
export const setSortBy = (value) => useOrderStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useOrderStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useOrderStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useOrderStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useOrderStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useOrderStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useOrderStore.setState({ searchBy: value });

export const setDateAdded = (value) =>
  useOrderStore.setState({ dateAdded: value });
export const setDateModified = (value) =>
  useOrderStore.setState({ dateModified: value });
export const setStatus = (value) => useOrderStore.setState({ status: value });
export const setPaymentType = (value) =>
  useOrderStore.setState({ paymentType: value });

export const setIsFilterMenu = (value) =>
  useOrderStore.setState({ isFilterMenu: value });
export const setRangeDate = (value) =>
  useOrderStore.setState({ rangeDate: value });
export const ClearFilters = () =>
  useOrderStore.setState({
    rangeDate: null,
    paymentType: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    selectedCity: null,
    searchBy: "customer_phone_number",
  });

export const iraqCities = [
  {
    title: "Baghdad",
    value: "baghdad",
  },
  {
    title: "Basra",
    value: "basra",
  },
  {
    title: "Mosul",
    value: "mosul",
  },
  {
    title: "Erbil",
    value: "erbil",
  },
  {
    title: "Sulaymaniyah",
    value: "sulaymaniyah",
  },
  {
    title: "Najaf",
    value: "najaf",
  },
  {
    title: "Karbala",
    value: "karbala",
  },
  {
    title: "Kirkuk",
    value: "kirkuk",
  },
  {
    title: "Nasiriyah",
    value: "nasiriyah",
  },
  {
    title: "Diwaniyah",
    value: "diwaniyah",
  },
  {
    title: "Amarah",
    value: "amarah",
  },
  {
    title: "Samawah",
    value: "samawah",
  },
  {
    title: "Ramadi",
    value: "ramadi",
  },
  {
    title: "Fallujah",
    value: "fallujah",
  },
  {
    title: "Tikrit",
    value: "tikrit",
  },
  {
    title: "Duhok",
    value: "duhok",
  },
  {
    title: "Baqubah",
    value: "baqubah",
  },
  {
    title: "Kut",
    value: "kut",
  },
  {
    title: "Hilla",
    value: "hilla",
  },
  {
    title: "Balad",
    value: "balad",
  },
];
