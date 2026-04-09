import { create } from "zustand"

export const useOrderStore = create(() => ({
  isOrderDialogOpen: false,
  isUpdateOrderProductDialogOpen: false,
  isUpdateOrderStatusDialogOpen: false,
  isPublishShipmentDialogOpen: false,
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
  searchBy: "filter_by_order_id",
  rangeDate: null,
}))

export const setIsOrderDialogOpen = (value) =>
  useOrderStore.setState({ isOrderDialogOpen: value })
export const setIsUpdateOrderProductDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderProductDialogOpen: value })
export const setIsUpdateOrderStatusDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderStatusDialogOpen: value })
export const setIsPublishShipmentDialogOpenDialogOpen = (value) =>
  useOrderStore.setState({ isPublishShipmentDialogOpen: value })
export const setIsDeleteOrderDialogOpen = (value) =>
  useOrderStore.setState({ isDeleteOrderDialogOpen: value })

export const setSelectedOrder = (value) =>
  useOrderStore.setState({ selectedOrder: value })
export const setSelectedCity = (value) =>
  useOrderStore.setState({ selectedCity: value })
export const setOrderDetails = (value) =>
  useOrderStore.setState({ orderDetails: value })
export const setProductsOrder = (value) =>
  useOrderStore.setState({ productsOrder: value })

export const setSortType = (value) =>
  useOrderStore.setState({ sortType: value })
export const setSortBy = (value) => useOrderStore.setState({ sortBy: value })
export const clearSortValue = () =>
  useOrderStore.setState({ sortBy: null, sortType: null })
export const setSearch = (value) => useOrderStore.setState({ search: value })
export const setDebouncedSearchValue = (value) =>
  useOrderStore.setState({ debouncedSearchValue: value })
export const setPage = (value) => useOrderStore.setState({ page: value })
export const setItemPerPage = (value) =>
  useOrderStore.setState({ itemPerPage: value })
export const setSearchBy = (value) =>
  useOrderStore.setState({ searchBy: value })

export const setDateAdded = (value) =>
  useOrderStore.setState({ dateAdded: value })
export const setDateModified = (value) =>
  useOrderStore.setState({ dateModified: value })
export const setStatus = (value) => useOrderStore.setState({ status: value })
export const setPaymentType = (value) =>
  useOrderStore.setState({ paymentType: value })

export const setIsFilterMenu = (value) =>
  useOrderStore.setState({ isFilterMenu: value })
export const setRangeDate = (value) =>
  useOrderStore.setState({ rangeDate: value })
export const ClearFilters = () =>
  useOrderStore.setState({
    rangeDate: null,
    paymentType: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    selectedCity: null,
    searchBy: "filter_by_order_id",
  })

export const iraqCities = [
  {
    name: "Al Anbar",
    name_ar: "الانبار",
    postcode: 1580,
  },
  {
    name: "Al Basrah",
    name_ar: "البصرة",
    postcode: 1573,
  },
  {
    name: "Al Karbala",
    name_ar: "كربلاء",
    postcode: 1578,
  },
  {
    name: "Al Muthanna",
    name_ar: "المثنى",
    postcode: 1575,
  },
  {
    name: "Al Qadisyah",
    name_ar: "القادسية",
    postcode: 1576,
  },
  {
    name: "Al Najaf",
    name_ar: "النجف",
    postcode: 1579,
  },
  {
    name: "Erbil",
    name_ar: "اربيل",
    postcode: 1583,
  },
  {
    name: "Sulaymaniyah",
    name_ar: "السليمانية",
    postcode: 1585,
  },
  {
    name: "Kirkuk",
    name_ar: "كركوك",
    postcode: 1584,
  },
  {
    name: "Babil",
    name_ar: "بابل",
    postcode: 1577,
  },
  {
    name: "Baghdad",
    name_ar: "بغداد",
    postcode: 1568,
  },
  {
    name: "Dahuk",
    name_ar: "دهوك",
    postcode: 1582,
  },
  {
    name: "Dhi Qar",
    name_ar: "ذي قار",
    postcode: 1574,
  },
  {
    name: "Diyala",
    name_ar: "ديالى",
    postcode: 1570,
  },
  {
    name: "Maysan",
    name_ar: "ميسان",
    postcode: 1572,
  },
  {
    name: "Ninawa",
    name_ar: "نينوى",
    postcode: 1581,
  },
  {
    name: "Salah ad Din",
    name_ar: "صلاح الدين",
    postcode: 1569,
  },
  {
    name: "Wasit",
    name_ar: "واسط",
    postcode: 1571,
  },
  {
    name: "Halabjah",
    name_ar: "حلبجة",
    postcode: 1572,
  },
]
