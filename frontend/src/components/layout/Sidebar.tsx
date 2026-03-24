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
  Store
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  to: "/" },
  { icon: ShoppingBag,     label: "Products",   to: "/products" },
  { icon: FolderTree,      label: "Categories", to: "/categories" },
  { icon: ShoppingCart,    label: "Orders",     to: "/orders" },
  { icon: Users,           label: "Customers",  to: "/customers" },
  { icon: Bookmark,        label: "Brands",     to: "/brands" },
  { icon: Star,            label: "Reviews",    to: "/reviews" },
  { icon: ImageIcon,       label: "Banners",    to: "/banners" },
  { icon: CreditCard,      label: "Payments",   to: "/payments" },
  { icon: Package,         label: "Inventory",  to: "/inventory" },
  { icon: Ticket,          label: "Coupons",    to: "/coupons" },
  { icon: Settings,        label: "Settings",   to: "/settings" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Store className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">EcomAdmin</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors ml-auto"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
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
            {sidebarOpen && <span>{label}</span>}
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
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
