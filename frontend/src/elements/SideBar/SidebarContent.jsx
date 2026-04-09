import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { SideBarItem } from "./SideBarItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {

  Circle,
  CircleDot,
  LogOut,
  X,
} from "lucide-react";

import altawoonBrand from "@/assets/images/altawoon.svg";

import {
  setIsCollapsed,
  setIsSideBarDrawerOpen,
  useHomeStore,
} from "@/pages/home/store";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";

const SidebarContent = ({ routes, onLogout }) => {
  const { isCollapsed } = useHomeStore();
  const {t}= useTranslation()
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleCloseSideBar=() =>{ setIsSideBarDrawerOpen(false) }
  return (
    <>
      <div className="w-full flex flex-col space-y-2  justify-center items-center h-fit">
        <div className="w-full flex flex-row gap-2  justify-start items-center h-fit">
          <Link onClick={handleCloseSideBar} to="/" className="w-full flex justify-center items-center">
            {/* {
             isCollapsed?
             <img
             src={smallLogo}
             alt="Brand"
             className="w-[70%] h-16 object-contain mx-4"
           />
             : */}

            <img
              src={altawoonBrand}
              alt="Brand"
              className={cn("w-[60%]  lg:w-[70%] h-16 object-contain mx-4")}
            />

            {/* } */}
          </Link>
          {isDesktop ? (
            <button
              className={cn(
                " flex justify-center items-center h-7 w-8 mr-2 rounded-full",
                isCollapsed ? "hidden group-hover:flex" : "flex"
              )}
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? (
                <CircleDot color="white" className="h-4 w-4" />
              ) : (
                <Circle color="white" className="h-4 w-4" />
              )}
            </button>
          ) : (
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                " flex justify-center items-center h-6 w-7 mr-2 rounded-full"
              )}
              onClick={() => {
                setIsSideBarDrawerOpen(false);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Separator className="bg-[#1E293B]" />
      </div>
      <ScrollArea className="h-full my-6 w-full">
        {routes.map((item) => (
           <Can isPublic={item.isPublic || false}  key={item.to} permissions={item?.permissions}>

             <SideBarItem
               
               title={item.title}
               to={item.to}
               items={item.items}
               icon={item.icon}
               shortcut={item.shortcut}
               permissions={item.permissions}
               isPublic={item.isPublic || false}
               isActive={
                 location.pathname === item.to ||
                 (item.items &&
                   item.items.some((subItem) => subItem.to === location.pathname))
               }
             />
           </Can>
        ))}
      </ScrollArea>
      <div className="w-full">
        <Separator className="bg-[#1E293B]" />
        <Button
          className="flex justify-start py-6 items-center text-gray-300 space-x-4 w-full rounded-none"
          onClick={onLogout}
          variant="ghost"
        >
          <LogOut size={20} />

          <span
            className={cn(
              "",
              isCollapsed ? "hidden group-hover:block" : "block"
            )}
          >
            {t("Log out")}
          </span>
        </Button>
      </div>
    </>
  );
};

export default SidebarContent;
