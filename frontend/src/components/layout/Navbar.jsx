import { Button } from "../ui/button";
import { User, User2 } from "lucide-react";
import { useAuthStore } from "@/pages/login/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import Translation from "./Translation";
import { useTranslation } from "react-i18next";

import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { NotificationsMenu } from "../../elements/Notifications";
import { setIsSuperuser, setSelectedWarehouseId, useHomeStore } from "@/pages/home/store";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { USERS_URL } from "@/utils/constants/urls";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
const Navbar = () => {
  const { userData } = useAuthStore();
  const { t } = useTranslation();

  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  const {  selectedWarehouseId, isSuperuser } = useHomeStore();
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
    queryKey: ["UserDetails", userData?.id],
    queryFn: () => fetchAdminUsersDetails(userData?.id),
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

  return (
    <nav className="flex w-full  justify-between border-b items-center h-[65px] space-x-4 py-[12.5px] px-4 ">
      <div className="flex justify-start items-center gap-2 ">
        {/* <Link to="/" className="w-fit h-full flex justify-center items-center">
          <img
            src={Logo}
            alt="Logo"
            className={cn("w-[100px] md:w-[100px] h-full object-cover mx-0")}
          />
        </Link> */}
        {(!open || isMobile) && <SidebarTrigger />}
      </div>

      <div className="flex justify-start items-center gap-2">
        <NotificationsMenu />
        <Translation />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="px-0">
            <Button className="py-1 gap-0 sm:gap-2" variant="ghost">
              {/* <div className="hidden md:flex flex-col justify-start items-end">
                <p className="font-medium text-base text-slate-800">
                  {userData?.name || ""}
                </p>
                <p className="text-sm font-normal text-slate-500">
                   {userData?.phone }
                </p>
              </div> */}
              <div className="border px-2 py-2 rounded-full">
                <User2 size={20} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              {" "}
              <Button
                className="space-x-2 py-1 px-0 w-full justify-start cursor-default"
                variant="none"
              >
                <div className="border px-2 py-2 rounded-full">
                  <User2 size={18} />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p className="font-medium text-sm">
                    {user?.data?.username || ""}
                  </p>
                  {/* <p className="text-xs font-normal text-slate-500">
                    {userData?.phone}
                  </p> */}
                </div>
              </Button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link to={`/settings/admins/${userData?.id}`}>
              <DropdownMenuItem className="cursor-pointer px-4 ">
                <p className="flex justify-center items-center space-x-2">
                  <User className="mr-2 h-4 w-4" />
                  <span className="">{t("profile")}</span>
                </p>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
