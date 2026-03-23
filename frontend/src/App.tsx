import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ProductsPage from "@/features/products/ProductsPage";
import OrdersPage from "@/features/orders/OrdersPage";
import CustomersPage from "@/features/customers/CustomersPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import BrandsPage from "@/features/brands/BrandsPage";
import ReviewsPage from "@/features/reviews/ReviewsPage";
import BannersPage from "@/features/banners/BannersPage";
import SettingsPage from "@/features/settings/SettingsPage";
import CouponsPage from "@/features/coupons/CouponsPage";
import CategoriesPage from "@/features/categories/CategoriesPage";
import { PaymentsPage } from "@/features/misc/Pages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/banners" element={<BannersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
