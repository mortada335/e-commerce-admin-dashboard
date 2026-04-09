import { create } from "zustand";

export const useAdminUserStore = create(() => ({
  selectedUser: {},
}));

export const setSelectedUser = (value) => {
  useAdminUserStore.setState({ selectedUser: value });
};
