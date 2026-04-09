import { create } from "zustand"

export const useWarehousesStore = create(() => ({

    isWarehouseDialogOpen: false,
    isDeleteWarehouseDialogOpen: false,
    selectedWarehouse: null,
    sortType: null,
    sortBy: null,
    isFilterMenu: false,
    isZoneDialogOpen:false,
    selectedZone: null,
    isDeleteZoneDialogOpen: false,

}))

export const setSortType = (value) =>
  useWarehousesStore.setState({ sortType: value })
export const setSortBy = (value) => useWarehousesStore.setState({ sortBy: value })
export const setIsFilterMenu = (value) =>
  useWarehousesStore.setState({ isFilterMenu: value })
export const setIsWarehouseDialogOpen = (value) =>
  useWarehousesStore.setState({ isWarehouseDialogOpen: value })
export const setIsDeleteWarehouseDialogOpen = (value) =>
  useWarehousesStore.setState({ isDeleteWarehouseDialogOpen: value })
export const setSelectedWarehouse = (value) =>
  useWarehousesStore.setState({ selectedWarehouse: value })
export const clearSortValue = () =>
  useWarehousesStore.setState({ sortBy: null, sortType: null })
export const setIsZoneDialogOpen = (value)=>
  useWarehousesStore.setState({ isZoneDialogOpen: value});
export const setSelectedZone =(value)=>
  useWarehousesStore.setState({ selectedZone: value});
export const setIsDeleteZoneDialogOpen = (value) =>
  useWarehousesStore.setState({ isDeleteZoneDialogOpen: value})
