import { Bell, Sun, Moon, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/customers": "Customers",
  "/brands": "Brands",
  "/reviews": "Reviews",
  "/banners": "Banners",
  "/payments": "Payments",
  "/inventory": "Inventory",
  "/coupons": "Coupons",
  "/activity-log": "Activity Log",
  "/settings": "Settings",
};

export function Topbar() {
  const { user } = useAuthStore();
  const { toggleDarkMode, isDarkMode, toggleSidebar } = useUIStore();
  const { pathname } = useLocation();

  const title = Object.entries(pageTitles).find(([path]) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  )?.[1] ?? "Dashboard";

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 ml-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.roles?.[0]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
