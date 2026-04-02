import { NavLink, useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShoppingBag, FolderTree,
  ShoppingCart,
  Users,
  Bookmark,
  Star,
  Image as ImageIcon,
  CreditCard,
  Package,
  Ticket,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
  Activity,
  X
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",    to: "/",             permission: "view dashboard" },
  { icon: ShoppingBag,     label: "Products",     to: "/products",     permission: "view products" },
  { icon: FolderTree,      label: "Categories",   to: "/categories",   permission: "view categories" },
  { icon: ShoppingCart,    label: "Orders",       to: "/orders",       permission: "view orders" },
  { icon: Users,           label: "Customers",    to: "/customers",    permission: "view customers" },
  { icon: Bookmark,        label: "Brands",       to: "/brands",       permission: "view brands" },
  { icon: Star,            label: "Reviews",      to: "/reviews",      permission: "manage products" },
  { icon: ImageIcon,       label: "Banners",      to: "/banners",      permission: "manage products" },
  { icon: CreditCard,      label: "Payments",     to: "/payments",     permission: "view orders" },
  { icon: Package,         label: "Inventory",    to: "/inventory",    permission: "view inventory" },
  { icon: Ticket,          label: "Coupons",      to: "/coupons",      permission: "view coupons" },
  { icon: Activity,        label: "Activity Log", to: "/activity-log", permission: "view dashboard" },
  { icon: Settings,        label: "Settings",     to: "/settings",     role: "admin" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { logout, hasPermission, hasRole } = useAuthStore();
  const navigate = useNavigate();

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.role && !hasRole(item.role)) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  });

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    navigate("/login");
  };

  // Close sidebar on mobile when a nav link is clicked
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          // Mobile: slide in/out from left edge
          "lg:translate-x-0",
          sidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:w-16 lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Store className="w-4 h-4 text-primary" />
            </div>
            <span className={cn(
              "font-semibold text-sm text-foreground transition-opacity duration-200",
              !sidebarOpen && "lg:hidden"
            )}>
              EcomAdmin
            </span>
          </div>

          {/* Desktop: toggle collapse. Mobile: close button */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <span className="hidden lg:block">
              <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
            </span>
            <span className="lg:hidden">
              <X className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
          {filteredNavItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-200",
                !sidebarOpen && "lg:hidden"
              )}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={cn(
              "transition-opacity duration-200",
              !sidebarOpen && "lg:hidden"
            )}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
