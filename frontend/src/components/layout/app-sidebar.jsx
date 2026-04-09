
import { ChevronUp, User2, User } from "lucide-react"
import LogoLight from "/src/assets/images/altawoon.svg"
import LogoDark from "/src/assets/images/altawoon-dark.svg"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore, clearAccessToken, clearUserData } from "@/pages/login/store"
import { useConfig } from "@/context/config"
import { NavMain } from "./nav-main"
import items from "@/navigation"
import { clearPermissions, useHomeStore } from "@/pages/home/store"
import { deleteCookieValue } from "@/utils/methods"
import useMediaQuery from "@/hooks/useMediaQuery"
import { useEffect, useState, useContext } from "react"
import ThemeProviderContext from "@/context/theme/ThemeContext" // Import your theme context
import { USERS_URL } from "@/utils/constants/urls"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { useQuery } from "@tanstack/react-query"

export default function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { userData } = useAuthStore()
  const { config } = useConfig()
  const navigate = useNavigate()
  const { open } = useSidebar()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { isCollapsed, isSideBarDrawerOpen } = useHomeStore()
  const axiosPrivate = useAxiosPrivate();
  const fetchAdminUsersDetails = async (id) => {

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
console.log(user?.data?.data)
  // Use the theme from your ThemeProvider context
  const themeContext = useContext(ThemeProviderContext)
  
  // Determine the current theme for logo selection
  const getCurrentTheme = () => {
    if (!themeContext) return "light" // Fallback if context not available
    
    if (themeContext.theme === "system") {
      // If theme is set to system, check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    
    return themeContext.theme
  }

  const currentTheme = getCurrentTheme()
  const dynamicLogo = config?.logo || (currentTheme === "dark" ? LogoLight : LogoDark)

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userPermissions")
    localStorage.removeItem("user")
    deleteCookieValue("accessToken")
    clearAccessToken()
    clearUserData()
    clearPermissions()
    navigate("/login")
  }

  return (
    <Sidebar
      className="px-0 bg-background border-r"
      side={i18n.language === "ar" ? "right" : "left"}
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="px-0 bg-background">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between w-full items-center border-b px-4">
            {/* <Link to="/" className="w-full h-[53px] flex items-center"> */}
              <div  className="w-[100px] h-[53px] flex items-center">
                <img
                  src={dynamicLogo}
                  alt={config?.app_name || "Logo"}
                  className={cn("object-contain")}
                  onError={(e) => {
                    // Fallback if logo fails to load
                    const target = e.target 
                    target.src = currentTheme === "dark" ? LogoDark : LogoLight
                  }}
                />
              </div>
            {/* </Link> */}
            {open && <SidebarTrigger />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 bg-background">
        {items.map((item) => (
          <NavMain key={item.title} title={item.title} items={item.items} icon={item.icon} />
        ))}
      </SidebarContent>

      <SidebarFooter className="bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {user?.data?.data?.name || t("User")}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                {/* <DropdownMenuSeparator /> */}
                <Link to={`/settings/admins/${userData?.id}`}>
                  <DropdownMenuItem className="cursor-pointer px-4">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile")}</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer px-4 text-destructive">
                  {t("Log out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}