import { userAdminSchema } from "@/utils/validation/user"
import { create } from "zustand"

const getPermissions = () => {
  const p = localStorage.getItem("userPermissions");
  try {
    return p && p !== "undefined" ? JSON.parse(p) : [];
  } catch (e) {
    return [];
  }
};

const getIsSuperuser = () => {
  const s = localStorage.getItem("isSuperuser");
  try {
    return s && s !== "undefined" ? JSON.parse(s) : false;
  } catch (e) {
    return false;
  }
};

export const useHomeStore = create(() => ({
  isCollapsed: false,
  isSideBarDrawerOpen: false,
  isReFetchBaseOnNotification: false,
  userPermissions: getPermissions(),
  selectedWarehouseId: localStorage.getItem("selectedWarehouseId") || null,
  isSuperuser: getIsSuperuser(),
}));

export const setIsCollapsed = (value) =>
  useHomeStore.setState({ isCollapsed: value })

export const setIsReFetchBaseOnNotification = (value) =>
  useHomeStore.setState({ isReFetchBaseOnNotification: value })

export const setIsSideBarDrawerOpen = (value) =>
  useHomeStore.setState({ isSideBarDrawerOpen: value })

export const setUserPermissions = (value) =>
  useHomeStore.setState({ userPermissions: value })

export const clearPermissions = () =>
  useHomeStore.setState({ userPermissions: [] })

export const setSelectedWarehouseId = (value) => {
  if (value === null || value === undefined) {
    localStorage.removeItem("selectedWarehouseId")
  } else {
    localStorage.setItem("selectedWarehouseId", value)
  }
  useHomeStore.setState({ selectedWarehouseId: value })
}

export const setIsSuperuser = (value) => {
  localStorage.setItem("isSuperuser", JSON.stringify(Boolean(value)))
  useHomeStore.setState({ isSuperuser: Boolean(value) })
}
