import { getCookieValue } from "@/utils/methods";
import { create } from "zustand";
const savedAccessToken = getCookieValue("accessToken");

const savedUser = localStorage.getItem("user");
let parsedUser = null;
try {
  if (savedUser && savedUser !== "undefined") {
    parsedUser = JSON.parse(savedUser);
  }
} catch (error) {
  console.error("Failed to parse user from localStorage", error);
  parsedUser = null;
}

export const useAuthStore = create(() => ({
  accessToken: savedAccessToken || null,
  userData: parsedUser,
}));

export const setAccessToken = (value) =>
  useAuthStore.setState({ accessToken: value });

export const clearAccessToken = () =>
  useAuthStore.setState({ accessToken: null });
export const clearUserData = () => useAuthStore.setState({ userData: null });
export const setUserData = (value) =>
  useAuthStore.setState({ userData: value });
