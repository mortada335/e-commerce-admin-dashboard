import {
  Home,
  BarChart3,
  LayoutPanelTop,
  Bell,
  LayoutDashboard,
  PenTool,
  Store,
  Wallet,
  SquareUserRound,
  Settings,
  Package,
  Tags,
  Gift,
  Users,
  Shield,
  ClipboardList,
  Video,
  UserCheck,
  ShoppingCart,
  Trash2,
  Search,
  Coins,
  MessageSquareText,
  Tag,
} from "lucide-react";

// Menu items.
export default [
  {
    title: "Dashboard",
    permissions: ["app_api.view_hometitle"],
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        permissions: ["app_api.view_hometitle"],
      },
    ],
  },

  {
    title: "Sales",
    permissions: [
      "app_api.view_ocorder",
      "app_api.view_deliverycost",
      "app_api.change_deliverycost",
    ],
    items: [
      {
        title: "Orders",
        url: "/sales/orders",
        icon: ClipboardList,
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
      //   title: "Delivery Cost",
      //   url: "/sales/delivery-cost",
      //   icon: Coins,
      //   permissions: [
      //     "app_api.view_deliverycost",
      //     "app_api.change_deliverycost",
      //   ],
      // },
      {
        title: "Reports",
        url: "/sales/reports",
        icon: BarChart3,
        permissions: ["app_api.view_ocorder"],
      },
    ],
  },

  {
    title: "Sections",
    permissions: ["app_api.view_homepagesections"],
    items: [
      {
        title: "Sections",
        url: "/dashboards/sections",
        icon: LayoutPanelTop,
        permissions: ["app_api.view_homepagesections"],
      },
    ],
  },

  {
    title: "Notifications",
    permissions: ["app_api.view_firebasenotification"],
    items: [
      {
        title: "Notifications",
        url: "/dashboards/notifications",
        icon: Bell,
        permissions: ["app_api.view_firebasenotification"],
      },
    ],
  },

  {
    title: "Catalog",
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
        title: "Warehouses",
        url: "/catalog/warehouses",
        icon: Store,
        permissions: ["app_api.view_ocwarehouse"],
      },
      {
        title: "Products",
        url: "/catalog/products",
        icon: Package,
        permissions: ["app_api.view_ocproduct"],
      },
      {
        title: "Categories",
        url: "/catalog/categories",
        icon: Tags,
        permissions: [
          "app_api.view_occategory",
          "app_api.change_occategory",
        ],
      },
    ],
  },

  {
    title: "Design",
    permissions: [
      "app_api.view_ocbannerimage",
      "app_api.view_slide",
      "app_api.view_appicon",
    ],
    items: [
      {
        title: "Banners",
        url: "/design/banners",
        icon: PenTool,
        permissions: ["app_api.view_ocbannerimage"],
      },
      {
        title: "Home Videos",
        url: "/design/home-videos",
        icon: Video,
        permissions: ["app_api.view_ocbannerimage"],
      },
      {
        title: "App Icons",
        url: "/design/app-icons",
        icon: LayoutDashboard,
        permissions: ["app_api.view_appicon"],
      },
    ],
  },

  {
    title: "E-commerce",
    permissions: [
      "app_api.view_occoupon",
      "app_api.view_couponoffer",
      "app_api.view_giftcard",
    ],
    items: [
      {
        title: "Promo Codes",
        url: "/ecommerce/promo-codes",
        icon: Tag,
        permissions: ["app_api.view_occoupon"],
      },
      {
        title: "Reward Promo Codes",
        url: "/ecommerce/reward-promo-codes",
        icon: Gift,
        permissions: ["app_api.view_occoupon"],
      },
      {
        title: "Promo Codes Points",
        url: "/ecommerce/promo-codes-points",
        icon: Coins,
        permissions: ["app_api.view_couponoffer"],
      },
    ],
  },

  {
    title: "Wallet",
    permissions: ["app_api.view_giftcard"],
    items: [
      {
        title: "Wallet Transactions",
        url: "/wallet/wallet-transactions",
        icon: Wallet,
        permissions: ["app_api.view_giftcard"],
      },
    ],
  },

  {
    title: "Users",
    permissions: [
      "app_api.view_user",
      "app_api.view_occustomermembership",
      "app_api.view_userrank",
      "app_api.view_deleteduser",
    ],
    items: [
      {
        title: "Customers List",
        url: "/users",
        icon: Users,
        permissions: ["app_api.view_currencyexchange"],
      },
      {
        title: "Deleted Users",
        url: "/deleted-users",
        icon: Trash2,
        permissions: ["app_api.view_deleteduser"],
      },
      {
        title: "Customers Carts",
        url: "/users-cart",
        icon: ShoppingCart,
        permissions: ["app_api.view_currencyexchange"],
      },
      {
        title: "Recent Products",
        url: "/users-recent-products",
        icon: Package,
        permissions: ["app_api.view_currencyexchange"],
      },
      {
        title: "Search History",
        url: "/users-search-history",
        icon: Search,
        permissions: ["app_api.view_currencyexchange"],
      },
      {
        title: "Membership",
        url: "/users/membership",
        icon: SquareUserRound,
        permissions: ["app_api.view_occustomermembership"],
      },
      {
        title: "Ranks",
        url: "/users/ranks",
        icon: UserCheck,
        permissions: ["app_api.view_userrank"],
      },
      {
        title: "chatpage",
        url: "/chatpage",
        icon: MessageSquareText,
        permissions: ["app_api.view_userrank"],
      },
    ],
  },

  {
    title: "Settings",
    permissions: [
      "app_api.change_userrank",
      "app_api.change_currencyexchange",
    ],
    items: [
      {
        title: "Admins",
        url: "/settings/admins",
        icon: Shield,
        permissions: ["app_api.view_currencyexchange"],
      },
      {
        title: "Currency Exchange",
        url: "/settings/currency-exchange",
        icon: Coins,
        permissions: ["app_api.change_currencyexchange"],
      },
      {
        title: "Roles",
        url: "/roles",
        icon: Settings,
        permissions: ["app_api.view_hometitle"],
      },
    ],
  },
];
