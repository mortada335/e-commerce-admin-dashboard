import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  ArrowLeft, User, Mail, Phone, MapPin, ShoppingCart, ChevronLeft, ChevronRight,
  Calendar, DollarSign, TrendingUp,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ordersPage, setOrdersPage] = useState(1);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.get(Number(id)),
    enabled: !!id,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["customer-orders", id, ordersPage],
    queryFn: () => customersApi.orders(Number(id), ordersPage),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Customer not found</p>
        <button onClick={() => navigate("/customers")} className="mt-4 text-primary text-sm hover:underline">← Back to Customers</button>
      </div>
    );
  }

  const orders = ordersData?.data ?? [];
  const ordersMeta = ordersData?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/customers")}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold">
            {customer.first_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{customer.full_name}</h2>
            <p className="text-sm text-muted-foreground">
              Member since {formatDate(customer.created_at)}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${customer.is_active ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                {customer.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{customer.orders_count ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(customer.total_spent ?? 0)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Avg Order</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(customer.avg_order_value ?? 0)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Last Order</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{customer.last_order_date ? formatDate(customer.last_order_date) : "Never"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Profile Card */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{customer.phone || "—"}</span>
              </div>
              {customer.gender && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground capitalize">{customer.gender}</span>
                </div>
              )}
              {customer.date_of_birth && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{customer.date_of_birth}</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Address
            </h3>
            {customer.address?.line1 ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{customer.address.line1}</p>
                {customer.address.line2 && <p>{customer.address.line2}</p>}
                <p>{customer.address.city}, {customer.address.state} {customer.address.zip}</p>
                <p>{customer.address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No address on file</p>
            )}
          </div>
        </div>

        {/* Right — Orders History */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" /> Order History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    {["Order #", "Status", "Payment", "Items", "Total", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {ordersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-5" /></td>)}</tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet</td>
                    </tr>
                  ) : orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                      <td className="px-4 py-3 font-mono text-xs text-primary">{o.order_number}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.payment_status)}`}>{o.payment_status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{o.items?.length ?? 0}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {ordersMeta && ordersMeta.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Page {ordersMeta.current_page} of {ordersMeta.last_page}</p>
                <div className="flex gap-1">
                  <button onClick={() => setOrdersPage((p) => Math.max(1, p - 1))} disabled={ordersMeta.current_page === 1}
                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setOrdersPage((p) => Math.min(ordersMeta.last_page, p + 1))} disabled={ordersMeta.current_page === ordersMeta.last_page}
                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
