import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/layout/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Rows3, User2 } from "lucide-react";
import {
  ADD_PERMISSION_TO_USER,
  WAREHOUSES_URL,
  USERS_URL,
} from "@/utils/constants/urls";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  clearPermissions,
  setIsSideBarDrawerOpen,
  useHomeStore,
  setSelectedWarehouseId,
  setIsSuperuser,
} from "@/pages/home/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { NotificationsMenu } from "../Notifications";
import { deleteCookieValue } from "@/utils/methods";
import Can from "@/components/Can";
import { useQuery } from "@tanstack/react-query";

import {
  clearAccessToken,
  clearUserData,
  useAuthStore,
} from "@/pages/login/store";
import Translation from "@/components/layout/Translation";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useTranslation } from "react-i18next";

const Navbar = ({ showNotificationsMenu = true }) => {
  const { userData } = useAuthStore();
  const {t} = useTranslation()

  const navigate = useNavigate();
  const { isSideBarDrawerOpen, selectedWarehouseId, isSuperuser } = useHomeStore();
  const [warehouse, setWarehouse] = useState([])
  const axiosPrivate = useAxiosPrivate();

  const fetchAdminUsersDetails = async (id) => {
    console.log("rrq run");

    return axiosPrivate.get(`${USERS_URL}${id}/`);
  };
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["UserDetails", userData?.user_id],
    queryFn: () => fetchAdminUsersDetails(userData?.user_id),
    // enabled: !!userData?.id,
  });

  useEffect(() => {
    console.log("userData", user);
    setWarehouse(user?.data?.warehouse_ids);
    if (user?.data) {
      if (user?.data?.is_superuser !== undefined) {
        setIsSuperuser(Boolean(user?.data?.is_superuser));
      }
      const warehouses = user?.data?.warehouses || user?.data?.user_warehouses || user?.data?.warehouse_ids;
      if (!isSuperuser && Array.isArray(warehouses) && warehouses.length && !selectedWarehouseId) {
        const firstId = typeof warehouses[0] === 'object' ? warehouses[0]?.id : warehouses[0];
        if (firstId !== undefined && firstId !== null) setSelectedWarehouseId(String(firstId));
      }
    }
  }, [user]);

  // When user selects a warehouse from the combobox, set the selectedWarehouseId
  // so dependent queries (with keys including selectedWarehouseId) refetch automatically.
  useEffect(() => {
    if (isSuperuser) {
      // Superusers are not limited by warehouse; clear selection
      setSelectedWarehouseId(null);
      return;
    }

    if (Array.isArray(warehouse) && warehouse.length > 0) {
      const selectedId = typeof warehouse[0] === 'object' ? warehouse[0]?.id : warehouse[0];
      if (selectedId !== undefined && selectedId !== null) {
        setSelectedWarehouseId(String(selectedId));
      }
    } else {
      setSelectedWarehouseId(null);
    }
  }, [warehouse, isSuperuser]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userPermissions");
    localStorage.removeItem("user");
    navigate("/login");
    deleteCookieValue("accessToken");
    clearAccessToken();
    clearUserData();
    clearPermissions();
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleClick = () => {
    setIsSideBarDrawerOpen(!isSideBarDrawerOpen);
  };

  return (
    <nav className="flex w-full  justify-between border-b items-center h-[65px] space-x-4 py-[12.5px] px-5 mb-8">
      {!isDesktop ? (
        <Button onClick={handleClick} variant="outline" size="icon">
          <Rows3 className="h-4 w-4" />
        </Button>
      ) : (
        <div></div>
      )}
      <div className="flex w-fir  justify-end items-center h-full gap-2">
        <div className="h-fit w-fit">
         {/* <CustomsMultiCombobox
          itemKey={"id"}
          setItems={setWarehouse}
          items={warehouse}
          itemTitle="name"
          endpoint={WAREHOUSES_URL}
          searchQueryKey="model"
          sortBy="-date_added"
          queryKey="warehouses"
          className="border rounded-md px-1"
          placeholder={t("Select Warehouse")}
        /> */}
        </div>
        {/* {!isSuperuser && (
          <Select
            value={selectedWarehouseId ?? undefined}
            onValueChange={(value) => setSelectedWarehouseId(value)}
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder={"Warehouse"} />
            </SelectTrigger>
            <SelectContent side="top">
              {warehouse.map((e) => (
                <SelectItem key={e} value={`${e}`}>
                  {e}
                </SelectItem>
              ))}
              {(Array.isArray(warehouse) ? warehouse : []).map((w) => {
                const id = typeof w === 'object' ? w?.id : w;
                const label = typeof w === 'object' ? (w?.name || w?.id) : w;
                return (
                  <SelectItem key={id} value={`${id}`}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )} */}

        {showNotificationsMenu && <NotificationsMenu />}
        <Translation />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="space-x-2 py-1" variant="ghost">
              <div className="flex flex-col justify-start items-end">
                <p className="font-bold text-base">
                  {userData?.phone_number || ""}
                </p>
                <p className="text-sm font-normal text-[#888888]">Super User</p>
              </div>
              <div className="border px-2 py-2 rounded-full">
                <User2 />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Can permissions={["app_api.view_ocuser"]}>
              <Link to={`/settings/admins/${userData?.user_id}`}>
                <DropdownMenuItem className="flex justify-start items-center space-x-2">
                  {" "}
                  <User2 size={16} /> <span>Profile</span>{" "}
                </DropdownMenuItem>
              </Link>
            </Can>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
