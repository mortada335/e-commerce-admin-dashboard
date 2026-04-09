import { create } from "zustand";

export const useOrderByCityReportsStore = create(() => ({
  isBillReportsDialogOpen: false,
  isDeleteBillReportsDialogOpen: false,
  selectedBillReport: null,
  sortType: null,
  sortBy: null,
  isFilterMenu: false,
}));

export const setSortType = (value) =>
  useOrderByCityReportsStore.setState({ sortType: value });
export const setSortBy = (value) => useOrderByCityReportsStore.setState({ sortBy: value });
export const setIsFilterMenu = (value) =>
  useOrderByCityReportsStore.setState({ isFilterMenu: value });
export const setIsBillReportsDialogOpen = (value) =>
  useOrderByCityReportsStore.setState({ isBillReportsDialogOpen: value });
export const setIsDeleteBillReportsDialogOpen = (value) =>
  useOrderByCityReportsStore.setState({ isDeleteBillReportsDialogOpen: value });
export const setSelectedBillReport = (value) =>
  useOrderByCityReportsStore.setState({ selectedBillReport: value });
export const clearSortValue = () =>
  useOrderByCityReportsStore.setState({ sortBy: null, sortType: null }); 