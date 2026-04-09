import { useLocation, useNavigate } from "react-router-dom";

import { Drawer } from "vaul";

import useMediaQuery from "@/hooks/useMediaQuery";
import SidebarContent from "./SidebarContent";
import { cn } from "@/lib/utils";
import {
  clearPermissions,
  setIsSideBarDrawerOpen,
  useHomeStore,
} from "@/pages/home/store";
import { clearAccessToken, clearUserData } from "@/pages/login/store";
import { deleteCookieValue } from "@/utils/methods";
import { useTranslation } from "react-i18next";

// Sidebar component
const Sidebar = () => {
  // Create a ref for the <aside> element

  const { t } = useTranslation();
  const { isCollapsed, isSideBarDrawerOpen } = useHomeStore();
  const location = useLocation();

  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const routes = [
    //home
    {
      id: 0,
      isActive: location.pathname === "/",
      title: t("Dashboard"),
      to: "/",
      icon: "home",
      // shortcut: "H",
      permissions: [""],
      isPublic: true,
    },
    //sales
    {
      id: 4,

      title: t("Sales"),
      to: "/sales",
      isActive: location.pathname.includes("/sales"),
      icon: "bar-chart-3",
      permissions: [
        "app_api.view_ocorder",
        "app_api.view_deliverycost",
        "app_api.change_deliverycost",
      ],
      items: [
        {
          title: t("Orders"),
          to: "/sales/orders",
          isActive: location.pathname === "/sales/orders",
          icon: "circle-dot",
          // shortcut: "O",
          permissions: ["app_api.view_ocorder"],
        },
        // {
        //   title: t("Orders Payment"),
        //   to: "/sales/orders-payment",
        //   isActive: location.pathname === "/sales/orders-payment",
        //   icon: "circle-dot",
        //   // shortcut: "",
        //   permissions: ["app_api.view_ocorder"],
        // },
        // {
        //   title: "Orders(V1)",
        //   to: "/sales/orders-v1",
        //   isActive: location.pathname === "/sales/orders-v1",
        //   icon: "circle-dot",
        //   shortcut: "",
        //   permissions: ["app_api.view_ocorder"],
        // },
        // {
        //   title: "Orders(V1) Payment",
        //   to: "/sales/orders-v1-payment",
        //   isActive: location.pathname === "/sales/orders-v1-payment",
        //   icon: "circle-dot",
        //   shortcut: "",
        //   permissions: ["app_api.view_ocorder"],
        // },

        {
          title: t("Delivery Cost"),
          isActive: location.pathname === "/sales/delivery-cost",
          icon: "circle-dot",
          to: "/sales/delivery-cost",
          // shortcut: "D",
          permissions: [
            "app_api.view_deliverycost",
            "app_api.change_deliverycost",
          ],
        },
        {
          title: t("Reports"),
          isActive: location.pathname === "/sales/reports",
          icon: "circle-dot",
          to: "/sales/reports",
          // shortcut: "R",
          permissions: ["app_api.view_ocorder"],
        },
      ],
    },
    //sections
    {
      id: 2,

      title: t("Sections"),
      to: "/dashboards/sections",
      isActive: location.pathname === "/dashboards/sections",
      icon: "layout-panel-top",
      // shortcut: "S",
      permissions: ["app_api.view_homepagesections"],
    },
    //notifications
    {
      title: t("Notifications"),
      to: "/dashboards/notifications",
      isActive: location.pathname.includes("/dashboards/notifications"),
      icon: "bell",
      // shortcut: "N",
      permissions: ["app_api.view_firebasenotification"],
    },
    //catalog
    {
      id: 1,
      to: "catalog",
      isActive: location.pathname.includes("catalog"),
      title: t("Catalog"),
      icon: "layout-dashboard",
      permissions: [
        "app_api.view_occategory",
        "app_api.view_ocwarehouse",
        "app_api.view_ocproduct",
        "app_api.view_ocmanufacturer",
        "app_api.view_ocattributegroup",
        "app_api.view_ocattribute",
      ],
      items: [
        {
          id: 0,
          title: t("Warehouses"),
          icon: "circle-dot",
          to: "/catalog/warehouses",
          isActive: location.pathname === "/catalog/warehouses",
          // shortcut: "W",
          permissions: ["app_api.view_ocwarehouse"],
        },
        {
          id: 1,
          title: t("Products"),
          icon: "circle-dot",
          to: "/catalog/products",
          isActive: location.pathname === "/catalog/products",
          // shortcut: "P",
          permissions: ["app_api.view_ocproduct"],
        },
        {
          id: 2,
          title: t("Categories"),
          to: "/catalog/categories",
          isActive: location.pathname === "/catalog/categories",
          // shortcut: "C",
          icon: "circle-dot",
          permissions: [
            "app_api.view_occategory",
            "app_api.change_occategory",
          ],
        },
        // {
        //   title: "Brands List",
        //   to: "/catalog/brands",
        //   icon: "circle-dot",
        //   isActive: location.pathname == "/catalog/brands",
        //   shortcut: "B",
        //   permissions: ["app_api.view_ocmanufacturer"],
        // },

        // {
        //   id: 3,
        //   title: t("Attributes Group"),
        //   to: "/catalog/products/attributes-group",
        //   isActive: location.pathname === "/catalog/products/attributes-group",
        //   // shortcut: "G",
        //   icon: "circle-dot",
        //   permissions: [
        //     "app_api.view_ocattributegroup",
        //     "app_api.change_ocattributegroup",
        //   ],
        // },
        // {
        //   id: 4,
        //   title: t("Attributes"),
        //   to: "/catalog/products/attributes",
        //   isActive: location.pathname === "/catalog/products/attributes",
        //   // shortcut: "A",
        //   icon: "circle-dot",
        //   permissions: ["app_api.view_ocattribute"],
        // },
      ],
    },
    //design
    {
      id: 3,

      title: t("Design"),
      to: "/design",
      isActive: location.pathname.includes("design"),
      icon: "pen-tool",
      permissions: [
        "app_api.view_ocbannerimage",
        "app_api.view_slide",
        "app_api.view_appicon",
      ],
      items: [
        {
          title: t("Banners"),
          to: "/design/banners",
          isActive: location.pathname.includes("/design/banners"),
          icon: "circle-dot",
          permissions: ["app_api.view_ocbannerimage"],
        },
        {
          title: t("Home Videos"),
          to: "/design/home-videos",
          isActive: location.pathname.includes("/design/home-videos"),
          icon: "circle-dot",
          permissions: ["app_api.view_ocbannerimage"],
        },
        {
          title: t("App Icons"),
          to: "/design/app-icons",
          isActive: location.pathname.includes("/design/app-icons"),
          icon: "circle-dot",
          permissions: ["app_api.view_appicon"],
        },
        //TODO
        // {
        //   title: "Slides",
        //   to: "/design/slides",
        //   icon: "circle-dot",
        //   isActive: location.pathname.includes("/design/slides"),
        //   permissions:["app_api.view_slide"],
        // },
      ],
    },

    //ecommerce
    {
      id: 5,
      title: t("E-commerce"),
      to: "/ecommerce",
      isActive: location.pathname.includes("/ecommerce"),
      icon: "store",
      permissions: [
        "app_api.view_occoupon",
        "app_api.view_couponoffer",
        "app_api.view_giftcard",
      ],
      items: [
        {
          title: t("Promo Codes"),
          to: "/ecommerce/promo-codes",
          icon: "circle-dot",
          isActive: location.pathname === "/ecommerce/promo-codes",
          permissions: ["app_api.view_occoupon"],
        },
        {
          title: t("Reward Promo Codes"),
          to: "/ecommerce/reward-promo-codes",
          icon: "circle-dot",
          isActive: location.pathname === "/ecommerce/reward-promo-codes",
          permissions: ["app_api.view_occoupon"],
        },

        {
          title: t("Promo Codes Points"),
          to: "/ecommerce/promo-codes-points",
          icon: "circle-dot",
          isActive: location.pathname === "/ecommerce/promo-codes-points",
          permissions: ["app_api.view_couponoffer"],
        },
      ],
    },
    //wallet
    {
      id: 5,
      title: t("Wallet"),
      to: "/wallet",
      isActive: location.pathname.includes("/wallet"),
      icon: "wallet",
      permissions: ["app_api.view_giftcard"],
      items: [
        // {
        //   title: t("Gift Cards"),
        //   to: "/wallet/gift-cards",
        //   icon: "circle-dot",
        //   isActive: location.pathname === "/wallet/gift-cards",
        //   permissions: ["app_api.view_giftcard"],
        // },
        {
          title: t("Wallet Transactions"),
          to: "/wallet/wallet-transactions",
          icon: "circle-dot",
          isActive: location.pathname === "/wallet/wallet-transactions",
          permissions: ["app_api.view_giftcard"],
        },
      ],
    },
    //customers
    {
      id: 6,
      title: t("Users"),
      to: "/users",
      isActive: location.pathname.includes("/users"),
      icon: "square-user-round",
      permissions: [
        "app_api.view_user",
        "app_api.view_occustomermembership",
        "app_api.view_userrank",
        "app_api.view_deleteduser",
      ],
      items: [
        {
          title: t("Customers List"),
          to: "/users",
          icon: "circle-dot",
          isActive: location.pathname === "/users",
          permissions: ["app_api.view_currencyexchange"],
          // shortcut: "U",
        },
        {
          title: t("Deleted Users"),
          to: "/deleted-users",
          icon: "circle-dot",
          isActive: location.pathname === "/deleted-users",
          permissions: ["app_api.view_deleteduser"],
          // shortcut: "U",
        },
        {
          title: t("Customers Carts"),
          to: "/users-cart",
          icon: "circle-dot",
          isActive: location.pathname === "/users-cart",
          permissions: ["app_api.view_currencyexchange"],
          // shortcut: "U",
        },
        {
          title: t("Recent Products"),
          to: "/users-recent-products",
          icon: "circle-dot",
          isActive: location.pathname === "/users-recent-products",
          permissions: ["app_api.view_currencyexchange"],
          // shortcut: "U",
        },
        {
          title: t("Search History"),
          to: "/users-search-history",
          icon: "circle-dot",
          isActive: location.pathname === "/users-search-history",
          permissions: ["app_api.view_currencyexchange"],
          // shortcut: "U",
        },
        {
          title: t("Membership"),
          to: "/users/membership",
          icon: "circle-dot",
          // shortcut: "M",
          isActive: location.pathname.includes("/users/membership"),
          permissions: ["app_api.view_occustomermembership"],
        },

        {
          title: t("Ranks"),
          to: "/users/ranks",
          icon: "circle-dot",
          permissions: ["app_api.view_userrank"],
          // shortcut: "R",
          isActive: location.pathname.includes("/users/ranks"),
        },
        {
          title: t("chatpage"),
          to: "/chatpage",
          icon: "circle-dot",
          permissions: ["app_api.view_userrank"],
          // shortcut: "R",
          isActive: location.pathname.includes("/chatpage"),
        },
      ],
    },
    //notes
    // {
    //   id: 7,
    //   isActive: location.pathname === "/notes",
    //   title: "Notes",
    //   to: "/notes",
    //   icon: "notebook-tabs",
    // },
    //settings
    {
      id: 8,
      to: "/settings",
      isActive: location.pathname.includes("settings"),
      title: t("Settings"),
      icon: "settings",
      permissions: [
        "app_api.change_userrank",
        "app_api.change_currencyexchange",
        "app_api.change_userrank",
      ],
      items: [
        {
          id: 1,
          isActive: location.pathname === "/settings/admins",
          title: t("Admins"),
          to: "/settings/admins",
          icon: "circle-dot",
          permissions: ["app_api.view_currencyexchange"],
        },
        {
          id: 2,
          isActive: location.pathname === "/settings/currency-exchange",
          title: t("Currency Exchange"),
          to: "/settings/currency-exchange",
          icon: "circle-dot",
          permissions: [
            "app_api.view_currencyexchange",
            "app_api.view_currencyexchange",
          ],
        },
        // {
        //   id: 3,
        //   isActive: location.pathname === "/settings/sms-logs",
        //   title: t("SMS Logs"),
        //   to: "/settings/sms-logs",
        //   icon: "circle-dot",
        //   permissions: ["app_api.view_currencyexchange"],
        // },
        {
          title: t("Roles"),
          to: "/roles",
          icon: "circle-dot",
          isActive: location.pathname === "/roles",
          permissions: ["app_api.change_userrank"],
        },
      ],
    },
  ];

  return isDesktop ? (
    <aside
      className={cn(
        "relative flex flex-col bg-[#1E1E1E] dark:bg-inherit border-r justify-between items-center h-full animate-out slide-out-from-left  duration-200 ease-out delay-100 group  z-50",
        isCollapsed
          ? "w-[100px] hover:w-[220px]  fixed inset-y-0 left-0"
          : "w-[220px] "
      )}
    >
      <SidebarContent
        isCollapsed={isCollapsed}
        routes={routes}
        onLogout={logout}
      />
    </aside>
  ) : (
    <Drawer.Root
      direction="left"
      open={isSideBarDrawerOpen}
      onOpenChange={setIsSideBarDrawerOpen}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-[#1E1E1E] flex flex-col  h-full w-[220px] mt-24 fixed bottom-0 lift-0">
          <SidebarContent
            isCollapsed={isCollapsed}
            routes={routes}
            onLogout={logout}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Sidebar;
