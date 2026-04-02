import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ProductsPage from "@/features/products/ProductsPage";
import ProductDetailPage from "@/features/products/ProductDetailPage";
import OrdersPage from "@/features/orders/OrdersPage";
import OrderDetailPage from "@/features/orders/OrderDetailPage";
import CustomersPage from "@/features/customers/CustomersPage";
import CustomerDetailPage from "@/features/customers/CustomerDetailPage";
import BrandsPage from "@/features/brands/BrandsPage";
import BrandDetailPage from "@/features/brands/BrandDetailPage";
import ReviewsPage from "@/features/reviews/ReviewsPage";
import ReviewDetailPage from "@/features/reviews/ReviewDetailPage";
import BannersPage from "@/features/banners/BannersPage";
import BannerDetailPage from "@/features/banners/BannerDetailPage";
import SettingsPage from "@/features/settings/SettingsPage";
import CouponsPage from "@/features/coupons/CouponsPage";
import CouponDetailPage from "@/features/coupons/CouponDetailPage";
import CategoriesPage from "@/features/categories/CategoriesPage";
import CategoryDetailPage from "@/features/categories/CategoryDetailPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import ActivityLogPage from "@/features/activity-log/ActivityLogPage";
import { PaymentsPage } from "@/features/misc/Pages";
import { useAuthStore } from "@/store/authStore";
import { ShieldX } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RequirePermission({ permission, children }: { permission: string; children: React.ReactNode }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  if (!hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldX className="w-7 h-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          You don't have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:id" element={<CategoryDetailPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:id" element={<BrandDetailPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/reviews/:id" element={<ReviewDetailPage />} />
              <Route path="/banners" element={<BannersPage />} />
              <Route path="/banners/:id" element={<BannerDetailPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/coupons" element={
                <RequirePermission permission="manage_coupons"><CouponsPage /></RequirePermission>
              } />
              <Route path="/coupons/:id" element={
                <RequirePermission permission="manage_coupons"><CouponDetailPage /></RequirePermission>
              } />
              <Route path="/settings" element={
                <RequirePermission permission="manage_settings"><SettingsPage /></RequirePermission>
              } />
              <Route path="/activity-log" element={<ActivityLogPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
