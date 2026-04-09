import { create } from "zustand"

export const useDeliveryCostStore = create(() => ({
  isUpdateDeliveryCostDialogOpen: false,

  selectedDeliveryCost: null,
}))

export const setSelectedDeliveryCost = (value) =>
  useDeliveryCostStore.setState({ selectedDeliveryCost: value })
export const setIsUpdateDeliveryCostDialogOpen = (value) =>
  useDeliveryCostStore.setState({ isUpdateDeliveryCostDialogOpen: value })
