import { lazy } from "react";

// -------------------- PUBLIC PAGES --------------------
const Login = lazy(() => import("@/pages/login"));
const NotAuthorize = lazy(() => import("@/pages/not-authorize"));
const NotFound = lazy(() => import("@/pages/not-found"));

// -------------------- MAIN LAYOUT PAGES --------------------
const Home = lazy(() => import("@/pages/home"));
const Sections = lazy(() => import("@/pages/sections"));
const GiftCards = lazy(() => import("@/pages/gift-cards"));
const WalletTransactions = lazy(() => import("@/pages/wallet-transactions"));
const AppIcons = lazy(() => import("@/pages/app-icons"));
const NotificationList = lazy(() => import("@/pages/notifications"));

// -------------------- CATALOG --------------------
const CategoryList = lazy(() => import("@/pages/categories"));
const CategoryDetails = lazy(() => import("@/pages/categories/category"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetails = lazy(() => import("@/pages/products/product"));
const AddProduct = lazy(() => import("@/pages/products/add-product/index"));
const Warehouses = lazy(() => import("@/pages/warehouses"));
const WarehouseDetails = lazy(() => import("@/pages/warehouses/warehouse"));
const Brands = lazy(() => import("@/pages/brands"));
const Brand = lazy(() => import("@/pages/brands/brand"));
const Attributes = lazy(() => import("@/pages/attributes"));
const ProductsAttributesGroupsList = lazy(() =>
  import("@/pages/attributes-groups")
);

// -------------------- SALES --------------------
const Orders = lazy(() => import("@/pages/orders"));
const OrdersV1 = lazy(() => import("@/pages/orders-v1"));
const OrderDetails = lazy(() => import("@/pages/orders/order"));
const OrderDetailsV1 = lazy(() => import("@/pages/orders-v1/order"));
const PrintOrder = lazy(() => import("@/pages/orders/order/print-order"));
const PrintOrderV1 = lazy(() => import("@/pages/orders-v1/order/print-order"));
const OrdersPayment = lazy(() => import("@/pages/orders-payment"));
const OrdersPaymentV1 = lazy(() => import("@/pages/orders-v1-payment"));
const Reports = lazy(() => import("@/pages/reports"));
const DeliveryCost = lazy(() => import("@/pages/delivery-costs"));

// -------------------- PROMOTIONS --------------------
const Coupons = lazy(() => import("@/pages/general-coupons"));
const CouponDetails = lazy(() =>
  import("@/pages/general-coupons/general-coupon")
);
const RewardCoupons = lazy(() => import("@/pages/reward-coupons"));
const RewardCouponDetails = lazy(() =>
  import("@/pages/reward-coupons/reward-coupon")
);
const PointsCoupons = lazy(() => import("@/pages/points-coupons"));

// -------------------- USERS --------------------
const Users = lazy(() => import("@/pages/users"));
const UserDetails = lazy(() => import("@/pages/users/user"));
const DeletedUsers = lazy(() => import("@/pages/deleted-users"));
const DeletedUserDetails = lazy(() =>
  import("@/pages/deleted-users/deleted-user")
);
const Membership = lazy(() => import("@/pages/customer-membership"));
const Ranks = lazy(() => import("@/pages/ranks"));
const UsersCart = lazy(() => import("@/pages/users-cart"));
const UserRecentProducts = lazy(() => import("@/pages/user-recent-products"));
const UserSearchHistory = lazy(() => import("@/pages/user-search-history"));

// -------------------- ROLES & ADMINS --------------------
const Roles = lazy(() => import("@/pages/roles"));
const RoleDetails = lazy(() => import("@/pages/roles/role"));
const Admins = lazy(() => import("@/pages/admins"));
const AdminUser = lazy(() => import("@/pages/admins/admin-user"));
const AddAdmin = lazy(() => import("@/pages/admins/add-admin"));

// -------------------- DESIGN --------------------
const Banners = lazy(() => import("@/pages/banners"));
const HomeVideos = lazy(() => import("@/pages/home-videos"));
const Slides = lazy(() => import("@/pages/slides"));

// -------------------- CHAT --------------------
const ChatPage = lazy(() => import("@/pages/chatpage"));
const AdminChatPage = lazy(() => import("@/pages/chatpage/user-chat"));

// -------------------- SETTINGS --------------------
const CurrencyExchange = lazy(() => import("@/pages/currency-exchange"));
const SMSLogs = lazy(() => import("@/pages/sms-logs"));

// -------------------- ROUTES --------------------

// 🟢 Public routes
export const publicRoutes = [
  { path: "login", element: <Login /> },
  { path: "not-authorize", element: <NotAuthorize /> },
];

// 🟢 Private routes
export const privateRoutes = [
  // Dashboard
  { path: "/", element: <Home />, index: true },
  { path: "dashboards/sections", element: <Sections /> },
  { path: "dashboards/notifications", element: <NotificationList /> },

  // Wallet
  { path: "wallet/gift-cards", element: <GiftCards /> },
  { path: "wallet/wallet-transactions", element: <WalletTransactions /> },

  // Catalog
  { path: "catalog/categories", element: <CategoryList /> },
  { path: "catalog/categories/details/:id", element: <CategoryDetails /> },
  { path: "catalog/products", element: <Products /> },
  { path: "catalog/products/addProduct", element: <AddProduct /> },
  { path: "catalog/products/details/:id", element: <ProductDetails /> },
  { path: "catalog/warehouses", element: <Warehouses /> },
  { path: "catalog/warehouses/details/:id", element: <WarehouseDetails /> },
  { path: "catalog/brands", element: <Brands /> },
  { path: "catalog/brands/details/:id", element: <Brand /> },
  // Optional attributes (commented in App.jsx)
  // { path: "catalog/products/attributes", element: <Attributes /> },
  // { path: "catalog/products/attributes-group", element: <ProductsAttributesGroupsList /> },

  // Design
  { path: "design/banners", element: <Banners /> },
  { path: "design/home-videos", element: <HomeVideos /> },
  { path: "design/app-icons", element: <AppIcons /> },
  { path: "design/slides", element: <Slides /> },

  // Sales
  { path: "sales/orders", element: <Orders /> },
  { path: "sales/orders/details/:id", element: <OrderDetails /> },
  { path: "sales/orders/details/:id/print-order", element: <PrintOrder /> },
  { path: "sales/orders-v1", element: <OrdersV1 /> },
  { path: "sales/orders-v1/details/:id", element: <OrderDetailsV1 /> },
  { path: "sales/orders-v1/details/:id/print-order", element: <PrintOrderV1 /> },
  // optional: payments
  // { path: "sales/orders-payment", element: <OrdersPayment /> },
  { path: "sales/orders-v1-payment", element: <OrdersPaymentV1 /> },
  { path: "sales/reports", element: <Reports /> },
  { path: "sales/delivery-cost", element: <DeliveryCost /> },

  // Promotions
  { path: "ecommerce/promo-codes", element: <Coupons /> },
  { path: "ecommerce/promo-codes/details/:id", element: <CouponDetails /> },
  { path: "ecommerce/reward-promo-codes", element: <RewardCoupons /> },
  { path: "ecommerce/reward-promo-codes/details/:id", element: <RewardCouponDetails /> },
  { path: "ecommerce/promo-codes-points", element: <PointsCoupons /> },

  // Users
  { path: "users", element: <Users /> },
  { path: "users/details/:id", element: <UserDetails /> },
  { path: "deleted-users", element: <DeletedUsers /> },
  { path: "deleted-users/details/:id", element: <DeletedUserDetails /> },
  { path: "users/membership", element: <Membership /> },
  { path: "users/ranks", element: <Ranks /> },
  { path: "users-cart", element: <UsersCart /> },
  { path: "users-recent-products", element: <UserRecentProducts /> },
  { path: "users-search-history", element: <UserSearchHistory /> },

  // Admins
  { path: "settings/admins", element: <Admins /> },
  { path: "settings/admins/:id", element: <AdminUser /> },
  { path: "settings/admins/add-new-admin", element: <AddAdmin /> },

  // Roles
  { path: "roles", element: <Roles /> },
  { path: "roles/:id", element: <RoleDetails /> },

  // Chat
  { path: "chatpage", element: <ChatPage /> },
  // optional:
  // { path: "admin/chat/:id", element: <AdminChatPage /> },

  // Settings
  { path: "settings/currency-exchange", element: <CurrencyExchange /> },
  // optional:
  // { path: "settings/sms-logs", element: <SMSLogs /> },
];

// 🟢 Catch-all route
export const catchAllRoute = {
  path: "*",
  element: <NotFound />,
};
