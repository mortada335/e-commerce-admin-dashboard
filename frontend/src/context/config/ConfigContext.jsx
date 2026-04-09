import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { USERS_URL } from "@/utils/constants/urls";
import {
  setIsSuperuser,
  setSelectedWarehouseId,
  useHomeStore,
} from "@/pages/home/store";
import { useAuthStore } from "@/pages/login/store";

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const { userData } = useAuthStore();
  const { isSuperuser, selectedWarehouseId } = useHomeStore();
  const [warehouse, setWarehouse] = useState([]);

  // === Fetch current user details ===
  const fetchAdminUsersDetails = async (id) => {
    if (!id) return null;
    return axiosPrivate.get(`${USERS_URL}${id}/`);
  };

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["UserDetails", userData?.user_id],
    queryFn: () => fetchAdminUsersDetails(userData?.user_id),
    enabled: !!userData?.user_id,
  });

  // === Update store & local state when user data changes ===
  useEffect(() => {
    if (user?.data) {
      setWarehouse(user?.data?.warehouse_ids);

      if (user?.data?.is_superuser !== undefined) {
        setIsSuperuser(Boolean(user?.data?.is_superuser));
      }

      const warehouses =
        user?.data?.warehouses ||
        user?.data?.user_warehouses ||
        user?.data?.warehouse_ids;

      if (
        !isSuperuser &&
        Array.isArray(warehouses) &&
        warehouses.length &&
        !selectedWarehouseId
      ) {
        const firstId =
          typeof warehouses[0] === "object"
            ? warehouses[0]?.id
            : warehouses[0];
        if (firstId !== undefined && firstId !== null) {
          setSelectedWarehouseId(String(firstId));
        }
      }
    }
  }, [user]);

  // === Ensure warehouse selection stays consistent ===
  useEffect(() => {
    if (isSuperuser) {
      setSelectedWarehouseId(null);
      return;
    }

    if (Array.isArray(warehouse) && warehouse.length > 0) {
      const selectedId =
        typeof warehouse[0] === "object" ? warehouse[0]?.id : warehouse[0];
      if (selectedId !== undefined && selectedId !== null) {
        setSelectedWarehouseId(String(selectedId));
      }
    } else {
      setSelectedWarehouseId(null);
    }
  }, [warehouse, isSuperuser]);

  // === Expose data and loading states ===
  const value = {
    user: user?.data || null,
    warehouses: warehouse,
    isSuperuser,
    selectedWarehouseId,
    isLoading,
    isError,
    error,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export default ConfigContext;
