import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate, formatRelativeDate, getStatusColor } from "@/lib/utils";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Eye } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "canceled", "refunded"];

export default function OrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", { search, status, page }],
    queryFn: () => ordersApi.list({ search, status, page }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Orders</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order # or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Order #", "Customer", "Items", "Status", "Payment", "Total", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>)}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No orders found</p>
                  </td>
                </tr>
              ) : orders.map((o: Record<string, unknown>) => (
                <tr key={o.id as number} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{o.order_number as string}</td>
                  <td className="px-4 py-3 text-foreground">{(o.customer as Record<string, string> | null)?.full_name ?? "Guest"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(o.items as unknown[])?.length ?? 0} items</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status as string}
                      onChange={(e) => statusMutation.mutate({ id: o.id as number, status: e.target.value })}
                      className={`text-xs rounded-full px-2 py-0.5 border-0 outline-none font-medium cursor-pointer ${getStatusColor(o.status as string)}`}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.payment_status as string)}`}>
                      {o.payment_status as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(o.total as number)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatRelativeDate(o.created_at as string)}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page === 1}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={meta.current_page === meta.last_page}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
