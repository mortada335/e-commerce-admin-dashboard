import api from "./axios";

export interface LoginCredentials { email: string; password: string; }

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post("/auth/login", credentials).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats").then((r) => r.data),
  salesChart: (days = 30) => api.get("/dashboard/sales-chart", { params: { days } }).then((r) => r.data),
  recentOrders: (limit = 10) => api.get("/dashboard/recent-orders", { params: { limit } }).then((r) => r.data),
  topProducts: (limit = 5) => api.get("/dashboard/top-products", { params: { limit } }).then((r) => r.data),
};

export interface ProductFilters {
  search?: string; category_id?: number; status?: string;
  sort_by?: string; sort_dir?: string; page?: number; per_page?: number; low_stock?: boolean;
}
export const productsApi = {
  list: (filters?: ProductFilters) => api.get("/products", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data: FormData) => api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id: number, data: FormData) => api.post(`/products/${id}`, data, { params: { _method: "PUT" }, headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  delete: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
  deleteImage: (productId: number, imageId: number) => api.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data),
};

export interface OrderFilters {
  search?: string; status?: string; payment_status?: string;
  date_from?: string; date_to?: string; page?: number; per_page?: number;
}
export const ordersApi = {
  list: (filters?: OrderFilters) => api.get("/orders", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/orders/${id}`).then((r) => r.data),
  updateStatus: (id: number, status: string, comment?: string) =>
    api.post(`/orders/${id}/status`, { status, comment }).then((r) => r.data),
};

export interface CustomerFilters { search?: string; is_active?: boolean; page?: number; per_page?: number; }
export const customersApi = {
  list: (filters?: CustomerFilters) => api.get("/customers", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/customers/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post("/customers", data).then((r) => r.data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/customers/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/customers/${id}`).then((r) => r.data),
  orders: (id: number, page = 1) => api.get(`/customers/${id}/orders`, { params: { page } }).then((r) => r.data),
};

export const categoriesApi = {
  list: (search?: string) => api.get("/categories", { params: { search } }).then((r) => r.data),
  tree: () => api.get("/categories/tree").then((r) => r.data),
  get: (id: number) => api.get(`/categories/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post("/categories", data).then((r) => r.data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export const couponsApi = {
  list: (filters?: { search?: string; is_active?: boolean; page?: number }) =>
    api.get("/coupons", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/coupons/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post("/coupons", data).then((r) => r.data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/coupons/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/coupons/${id}`).then((r) => r.data),
};

export const inventoryApi = {
  list: (filters?: { search?: string; page?: number }) => api.get("/inventory", { params: filters }).then((r) => r.data),
  alerts: () => api.get("/inventory/alerts").then((r) => r.data),
  updateStock: (productId: number, data: { stock_quantity: number; low_stock_threshold?: number }) =>
    api.patch(`/inventory/${productId}/stock`, data).then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get("/settings").then((r) => r.data),
  update: (settings: Record<string, string>) => api.put("/settings", { settings }).then((r) => r.data),
};

export const notificationsApi = {
  list: () => api.get("/notifications").then((r) => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.post("/notifications/read-all").then((r) => r.data),
};

export const brandsApi = {
  list: (filters?: { search?: string; is_active?: boolean; page?: number }) =>
    api.get("/brands", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/brands/${id}`).then((r) => r.data),
  create: (data: FormData) => api.post("/brands", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id: number, data: FormData) => api.post(`/brands/${id}`, data, { params: { _method: "PUT" }, headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  delete: (id: number) => api.delete(`/brands/${id}`).then((r) => r.data),
};

export const reviewsApi = {
  list: (filters?: { product_id?: number; is_approved?: boolean; page?: number }) =>
    api.get("/reviews", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/reviews/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) => api.post("/reviews", data).then((r) => r.data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/reviews/${id}`, data).then((r) => r.data),
  toggleApproval: (id: number) => api.post(`/reviews/${id}/toggle-approval`).then((r) => r.data),
  delete: (id: number) => api.delete(`/reviews/${id}`).then((r) => r.data),
};

export const bannersApi = {
  list: (filters?: { is_active?: boolean; page?: number }) =>
    api.get("/banners", { params: filters }).then((r) => r.data),
  get: (id: number) => api.get(`/banners/${id}`).then((r) => r.data),
  create: (data: FormData) => api.post("/banners", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id: number, data: FormData) => api.post(`/banners/${id}`, data, { params: { _method: "PUT" }, headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  delete: (id: number) => api.delete(`/banners/${id}`).then((r) => r.data),
};
